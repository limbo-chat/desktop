import Ajv from "ajv";
import { ulid } from "ulid";
import type * as limbo from "@limbo/api";
import type { PluginManager } from "../../plugins/core/plugin-manager";
import { getToolDefinitionsFromToolMap } from "../../tools/utils";
import { adaptPromptForCapabilities, transformBuiltInNodesInPrompt } from "./utils";

const ajv = new Ajv();

interface ExecuteToolCallOptions {
	tool: limbo.Tool;
	toolCall: limbo.ToolCall;
	assistantMessage: limbo.ChatMessage;
	abortSignal: AbortSignal;
}

async function executeToolCall({
	tool,
	toolCall,
	assistantMessage,
	abortSignal,
}: ExecuteToolCallOptions): Promise<limbo.SettledToolCall> {
	const validateArguments = ajv.compile(tool.schema);
	const areArgumentsValid = validateArguments(toolCall.arguments);

	if (!areArgumentsValid) {
		return {
			...toolCall,
			status: "error",
			error: "Invalid arguments",
		};
	}

	try {
		const result = await tool.execute({
			toolCall: toolCall,
			assistantMessage,
			abortSignal,
		});

		return {
			...toolCall,
			status: "success",
			result,
		};
	} catch (error) {
		let errorMessage = null;

		if (error instanceof Error) {
			if (error.name === "AbortError") {
				errorMessage = "Aborted";
			} else {
				errorMessage = error.message;
			}
		}

		return {
			...toolCall,
			status: "error",
			error: errorMessage,
		};
	}
}

interface HandleLLMToolCallOptions {
	toolCall: limbo.LLM.ToolCall;
	tools: Map<string, limbo.Tool>;
	assistantMessage: limbo.ChatMessage;
	abortSignal: AbortSignal;
}

async function handleLLMToolCall({
	toolCall,
	tools,
	assistantMessage,
	abortSignal,
}: HandleLLMToolCallOptions) {
	const tool = tools.get(toolCall.toolId);
	const toolCallId = ulid();

	const pendingToolCallNode = {
		type: "tool_call",
		data: {
			id: toolCallId,
			toolId: toolCall.toolId,
			arguments: toolCall.arguments,
			status: "pending",
		},
	};

	// add the tool call to the message
	assistantMessage.appendNode(pendingToolCallNode);

	let finalToolCall: limbo.SettledToolCall;

	if (tool) {
		finalToolCall = await executeToolCall({
			tool,
			toolCall: {
				id: toolCallId,
				toolId: toolCall.toolId,
				arguments: toolCall.arguments,
				// todo fix
				status: "pending",
			},
			assistantMessage,
			abortSignal: abortSignal,
		});
	} else {
		finalToolCall = {
			id: toolCallId,
			toolId: toolCall.toolId,
			arguments: toolCall.arguments,
			status: "error",
			error: "Tool not found",
		};
	}

	assistantMessage.replaceNode(pendingToolCallNode, {
		type: "tool_call",
		// @ts-expect-error
		data: finalToolCall,
	});

	return finalToolCall;
}

interface RunChatIterationOptions {
	generation: limbo.ChatGeneration;
	iteration: limbo.ChatIteration;
	tools: Map<string, limbo.Tool>;
	pluginManager: PluginManager;
	generationContext: limbo.ChatGenerationContext;
	abortSignal: AbortSignal;
}

async function runChatIteration({
	generation,
	iteration,
	tools,
	pluginManager,
	generationContext,
	abortSignal,
}: RunChatIterationOptions) {
	const toolDefinitions = getToolDefinitionsFromToolMap(tools);

	await pluginManager.executeOnBeforeChatIterationHooks({
		generation,
		iteration,
		context: generationContext,
		abortSignal,
	});

	transformBuiltInNodesInPrompt(iteration.prompt);

	adaptPromptForCapabilities({
		capabilities: generation.llm.capabilities,
		prompt: iteration.prompt,
	});

	const toolCallExecutionPromises: Promise<limbo.SettledToolCall>[] = [];

	let markdownContent = "";
	let lastMarkdownNode: limbo.ChatMessageNode | null = null;

	await generation.llm.chat({
		tools: toolDefinitions,
		assistantMessage: generation.assistantMessage,
		prompt: iteration.prompt,
		abortSignal: abortSignal,
		onText: (text) => {
			markdownContent += text;

			const newMarkdownNode = {
				type: "markdown",
				data: {
					content: markdownContent,
				},
			};

			if (lastMarkdownNode !== null) {
				generation.assistantMessage.replaceNode(lastMarkdownNode, newMarkdownNode);
			} else {
				generation.assistantMessage.appendNode(newMarkdownNode);
			}

			lastMarkdownNode = newMarkdownNode;
		},
		onToolCall: (toolCall) => {
			lastMarkdownNode = null;
			markdownContent = "";

			toolCallExecutionPromises.push(
				handleLLMToolCall({
					tools,
					toolCall,
					assistantMessage: generation.assistantMessage,
					abortSignal,
				})
			);
		},
	});

	// wait for all tool calls to finish executing
	const settledToolCalls = await Promise.all(toolCallExecutionPromises);

	// add the settled tool calls to the iteration
	for (const toolCall of settledToolCalls) {
		iteration.toolCalls.push(toolCall);
	}

	await pluginManager.executeOnAfterChatIterationHooks({
		generation,
		iteration,
		context: generationContext,
		abortSignal,
	});
}

export interface RunChatGenerationOptions {
	generation: limbo.ChatGeneration;
	pluginManager: PluginManager;
	tools: Map<string, limbo.Tool>;
	abortSignal: AbortSignal;
	maxIterations?: number;
}

export async function runChatGeneration({
	generation,
	pluginManager,
	tools,
	abortSignal,
	maxIterations = 1,
}: RunChatGenerationOptions) {
	const generationContext = new Map<string, unknown>();

	await pluginManager.executeOnBeforeChatGenerationHooks({
		generation,
		context: generationContext,
		abortSignal,
	});

	let iterationIdx = 0;

	while (true) {
		const iteration: limbo.ChatIteration = {
			index: iterationIdx,
			prompt: generation.prompt.clone(),
			toolCalls: [],
		};

		await runChatIteration({
			pluginManager,
			generation,
			iteration,
			generationContext,
			tools,
			abortSignal,
		});

		// add the iteration to the generation
		generation.iterations.push(iteration);

		const shouldContinue =
			iteration.toolCalls.length > 0 && iterationIdx < maxIterations && !abortSignal.aborted;

		if (!shouldContinue) {
			break;
		}

		iterationIdx++;
	}

	await pluginManager.executeOnAfterChatGenerationHooks({
		generation,
		context: generationContext,
	});
}
