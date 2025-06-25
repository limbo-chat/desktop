import Ajv from "ajv";
import { ulid } from "ulid";
import type * as limbo from "@limbo/api";
import type { PluginManager } from "../../plugins/core/plugin-manager";
import { ChatMessageBuilder, type ChatPromptBuilder } from "./chat-prompt-builder";
import { adaptChatPromptForCapabilities, transformBuiltInNodesInChatPrompt } from "./utils";

const ajv = new Ajv();

export interface ExecuteToolCallOptions {
	tool: limbo.Tool;
	args: any;
	messageHandle: limbo.MessageHandle;
	abortSignal: AbortSignal;
}

export type ExecuteToolCallResult =
	| { status: "success"; result: string }
	| { status: "error"; error: string | null };

export async function executeToolCall({
	tool,
	args,
	messageHandle,
	abortSignal,
}: ExecuteToolCallOptions): Promise<ExecuteToolCallResult> {
	const validateArguments = ajv.compile(tool.schema);
	const areArgumentsValid = validateArguments(args);

	if (!areArgumentsValid) {
		return {
			status: "error",
			error: "Invalid arguments",
		};
	}

	try {
		const result = await tool.execute({
			args,
			message: messageHandle,
			abortSignal,
		});

		return {
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
			status: "error",
			error: errorMessage,
		};
	}
}

export interface HandleLLMToolCallOptions {
	toolCall: limbo.LLM.ToolCall;
	tools: Map<string, limbo.Tool>;
	messageHandle: limbo.MessageHandle;
	abortSignal: AbortSignal;
}

async function handleLLMToolCall({
	toolCall,
	tools,
	messageHandle,
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
	messageHandle.appendNode(pendingToolCallNode);

	let finalToolCall: limbo.ToolCall;

	if (tool) {
		const toolCallResult = await executeToolCall({
			tool,
			args: toolCall.arguments,
			messageHandle,
			abortSignal: abortSignal,
		});

		finalToolCall = {
			id: toolCallId,
			toolId: toolCall.toolId,
			arguments: toolCall.arguments,
			...toolCallResult,
		};
	} else {
		finalToolCall = {
			id: toolCallId,
			toolId: toolCall.toolId,
			arguments: toolCall.arguments,
			status: "error",
			error: "Tool not found",
		};
	}

	messageHandle.replaceNode(pendingToolCallNode, {
		type: "tool_call",
		// @ts-expect-error
		data: finalToolCall,
	});

	return finalToolCall;
}

export interface HandleAssistantChatLoopOptions {
	chatId: string;
	pluginManager: PluginManager;
	chatPrompt: ChatPromptBuilder;
	messageHandle: limbo.MessageHandle;
	llm: limbo.LLM;
	tools: Map<string, limbo.Tool>;
	abortSignal: AbortSignal;
	maxIterations?: number;
}

export async function handleAssistantChatLoop({
	chatId,
	llm,
	pluginManager,
	chatPrompt,
	messageHandle,
	tools,
	abortSignal,
	maxIterations = 1,
}: HandleAssistantChatLoopOptions) {
	let iterations = 0;

	const toolDefinitions: limbo.LLM.Tool[] = [];

	for (const tool of tools.values()) {
		toolDefinitions.push({
			id: tool.id,
			description: tool.description,
			schema: tool.schema,
		});
	}

	while (iterations < maxIterations && !abortSignal.aborted) {
		// clone the chat prompt to avoid modifying the original
		const chatPromptClone = chatPrompt.clone();

		// add the current assistant message to the chat prompt
		if (iterations > 0) {
			chatPromptClone.appendMessage(
				new ChatMessageBuilder({
					role: "assistant",
					content: messageHandle.getNodes(),
				})
			);
		}

		transformBuiltInNodesInChatPrompt(chatPromptClone);

		await pluginManager.executeOnTransformChatPromptHooks({
			chatId,
			promptBuilder: chatPromptClone,
		});

		adaptChatPromptForCapabilities({
			capabilities: llm.capabilities,
			chatPromptBuilder: chatPromptClone,
		});

		const toolCallPromises: Promise<limbo.LLM.ToolCall>[] = [];

		let currentMarkdownNodeIdx: number | null = null;
		let currentMarkdownNodeContent = "";

		await llm.chat({
			tools: toolDefinitions,
			message: messageHandle,
			messages: chatPromptClone.toPromptMessages(),
			abortSignal: abortSignal,
			onText: (text) => {
				currentMarkdownNodeContent += text;

				if (typeof currentMarkdownNodeIdx === "number") {
					messageHandle.replaceNodeAt(currentMarkdownNodeIdx, {
						type: "markdown",
						data: {
							content: currentMarkdownNodeContent,
						},
					});
				} else {
					messageHandle.appendNode({
						type: "markdown",
						data: {
							content: currentMarkdownNodeContent,
						},
					});

					// set the current markdown node index to the last node
					currentMarkdownNodeIdx = messageHandle.getNodes().length - 1;
				}
			},
			onToolCall: (toolCall) => {
				currentMarkdownNodeIdx = null;

				const toolCallPromise = handleLLMToolCall({
					tools,
					toolCall,
					messageHandle,
					abortSignal,
				});

				toolCallPromises.push(toolCallPromise);
			},
		});

		if (toolCallPromises.length === 0) {
			break;
		}

		// wait for all tool calls to finish executing
		await Promise.allSettled(toolCallPromises);

		iterations++;
	}
}
