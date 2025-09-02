import type * as limbo from "@limbo-chat/api";
import Ajv from "ajv";
import { ulid } from "ulid";
import { getToolDefinitionsFromToolMap } from "../../tools/utils";

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
	abortSignal: AbortSignal;
}

async function runChatIteration({
	generation,
	iteration,
	tools,
	abortSignal,
}: RunChatIterationOptions) {
	const toolDefinitions = getToolDefinitionsFromToolMap(tools);
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
}

export interface RunChatGenerationOptions {
	generation: limbo.ChatGeneration;
	tools: Map<string, limbo.Tool>;
	abortSignal: AbortSignal;
	maxIterations?: number;
	onBeforeIteration: (iteration: limbo.ChatIteration) => void;
	onAfterIteration: (iteration: limbo.ChatIteration) => void;
}

export async function runChatGeneration({
	generation,
	tools,
	abortSignal,
	maxIterations = 1,
	onAfterIteration,
	onBeforeIteration,
}: RunChatGenerationOptions) {
	let iterationIdx = 0;

	while (true) {
		const iteration: limbo.ChatIteration = {
			index: iterationIdx,
			prompt: generation.prompt.clone(),
			toolCalls: [],
		};

		await onBeforeIteration(iteration);

		await runChatIteration({
			generation,
			iteration,
			tools,
			abortSignal,
		});

		// add the iteration to the generation
		generation.iterations.push(iteration);

		await onAfterIteration(iteration);

		const shouldContinue =
			iteration.toolCalls.length > 0 && iterationIdx < maxIterations && !abortSignal.aborted;

		if (!shouldContinue) {
			break;
		}

		iterationIdx++;
	}
}
