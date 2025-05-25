import Ajv from "ajv";
import { ulid } from "ulid";
import type * as limbo from "limbo";
import type { ChatNode, ToolCallChatNode } from "../../../../electron/chats/types";
import { useMainRouterClient } from "../../../lib/trpc";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { usePluginManager } from "../../plugins/hooks/core";
import { ChatPromptBuilder } from "../core/chat-prompt-builder";
import { useChatStore } from "../stores";

export interface SendMessageOptions {
	llm: limbo.LLM;
	chatId: string;
	message: string;
}

const ajv = new Ajv();

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();

	const sendMessage = async ({ llm, chatId, message }: SendMessageOptions) => {
		const chatStore = useChatStore.getState();

		// trigger the loading state
		chatStore.setIsAssistantResponsePending(true);

		// add user message to store

		const userMessageId = ulid();
		const userMessageCreatedAt = new Date().toISOString();

		chatStore.addMessage({
			role: "user",
			id: userMessageId,
			content: [
				{
					type: "text",
					text: message,
				},
			],
			createdAt: userMessageCreatedAt,
		});

		// add an empty placeholder for the assistant message
		const assistantMessageId = ulid();

		chatStore.addMessage({
			id: assistantMessageId,
			role: "assistant",
			status: "pending",
			content: [],
			createdAt: new Date().toISOString(),
		});

		// create a prompt builder and add the user's message to it

		const promptBuilder = new ChatPromptBuilder();

		// set the default chat system prompt
		promptBuilder.setSystemPrompt(
			"Answer the user's request using relevant tools (if they are available). Before calling a tool, think about which of the provided tools is the relevant tool to answer the user's request. Ensure tools are called in parallel if possible."
		);

		// add the user message to the prompt builder
		promptBuilder.appendMessage({
			role: "user",
			content: message,
		});

		// run the plugins on the executeOnBeforeAssistantResponseHooks lifecycle hook
		await pluginManager.executeOnBeforeAssistantResponseHooks({
			chatId,
			promptBuilder,
		});

		const plugins = pluginManager.getPlugins();

		const toolMap = new Map<string, limbo.Tool>();
		const toolDefinitions: limbo.LLM.Tool[] = [];

		for (const plugin of plugins) {
			const tools = plugin.context.getTools();

			for (const tool of tools) {
				const namespacedToolId = buildNamespacedResourceId(plugin.manifest.id, tool.id);

				toolMap.set(namespacedToolId, tool);

				toolDefinitions.push({
					id: namespacedToolId,
					description: tool.description,
					schema: tool.schema,
				});
			}
		}

		const assistantMessageChatNodes: ChatNode[] = [];

		try {
			// generate the assistant's response

			let shouldLoop = true;
			let iterations = 0;

			// max iterations to prevent catastrophic infinite loops
			// can reeavaluate this later
			while (shouldLoop && iterations < 25) {
				shouldLoop = false;

				let completeResponseText = "";
				const toolCalls: limbo.LLM.ToolCall[] = [];

				await llm.streamText({
					tools: toolDefinitions,
					messages: promptBuilder.toPromptMessages(),
					onText: (text) => {
						completeResponseText += text;

						// add the chunk to the assistant message in the store
						chatStore.addTextToMessage(assistantMessageId, text);
					},
					onToolCall: (toolCall) => {
						toolCalls.push(toolCall);
					},
				});

				if (completeResponseText.length > 0) {
					assistantMessageChatNodes.push({
						type: "text",
						text: completeResponseText,
					});
				}

				if (toolCalls.length > 0) {
					shouldLoop = true;

					// execute the tool calls in parallel
					await Promise.allSettled(
						toolCalls.map(async (toolCall) => {
							const tool = toolMap.get(toolCall.toolId);

							if (!tool) {
								return;
							}

							// generarte a unique call ID for the tool call
							const callId = ulid();

							// add the tool call in the pending state to the assistant message
							chatStore.addNodeToMessage(assistantMessageId, {
								type: "tool_call",
								status: "pending",
								arguments: toolCall.arguments,
								toolId: toolCall.toolId,
								callId,
							});

							// validate the tool call arguments

							const validateArguments = ajv.compile(tool.schema);
							const areArgumentsValid = validateArguments(toolCall.arguments);

							let finalToolCallNode: ToolCallChatNode;

							if (areArgumentsValid) {
								try {
									const result = await tool.execute(toolCall.arguments);

									finalToolCallNode = {
										type: "tool_call",
										toolId: toolCall.toolId,
										callId,
										arguments: toolCall.arguments,
										status: "success",
										result,
									};
								} catch (error) {
									let errorMessage = null;

									if (error instanceof Error) {
										errorMessage = error.message;
									}

									finalToolCallNode = {
										type: "tool_call",
										toolId: toolCall.toolId,
										callId,
										arguments: toolCall.arguments,
										status: "error",
										error: errorMessage,
									};
								}
							} else {
								chatStore.updateToolCallNode(assistantMessageId, callId, {
									status: "error",
									error: "Invalid arguments",
								});

								finalToolCallNode = {
									type: "tool_call",
									toolId: toolCall.toolId,
									callId,
									arguments: toolCall.arguments,
									status: "error",
									error: "Invalid arguments",
								};
							}

							// 1) add the tool call node to the assistant message
							assistantMessageChatNodes.push(finalToolCallNode);

							let resultStr;

							// 2) Update the tool call node in the store with the final result
							if (finalToolCallNode.status === "success") {
								resultStr = finalToolCallNode.result;

								chatStore.updateToolCallNode(assistantMessageId, callId, {
									status: finalToolCallNode.status,
									result: finalToolCallNode.result,
								});
							} else {
								resultStr = `Error: ${finalToolCallNode.error ?? "Unknown error"}`;

								chatStore.updateToolCallNode(assistantMessageId, callId, {
									status: finalToolCallNode.status,
									error: finalToolCallNode.error,
								});
							}

							// 3) Add the tool call to the prompt builder for subsequent generations
							promptBuilder.appendMessage({
								role: "tool",
								toolId: finalToolCallNode.toolId,
								callId,
								arguments: finalToolCallNode.arguments,
								result: resultStr,
							});
						})
					);
				}

				iterations++;
			}
		} catch (error) {
			// if there was an error during generation, remove the user's message and the assistant message
			chatStore.removeMessage(userMessageId);
			chatStore.removeMessage(assistantMessageId);

			// remove the pending state
			chatStore.setIsAssistantResponsePending(false);

			// rethrow the error
			throw error;
		}

		// mark the assistant message as complete
		chatStore.updateMessage(assistantMessageId, {
			role: "assistant",
			status: "complete",
			createdAt: new Date().toISOString(),
		});

		// save the user message and final assistant message to the database
		// we wait to do this until the end to avoid saving incomplete messages

		await mainRouter.chats.messages.create.mutate({
			id: userMessageId,
			role: "user",
			content: [
				{
					type: "text",
					text: message,
				},
			],
			chatId: chatId,
			createdAt: userMessageCreatedAt,
		});

		await mainRouter.chats.messages.create.mutate({
			id: assistantMessageId,
			chatId: chatId,
			role: "assistant",
			content: assistantMessageChatNodes,
			createdAt: new Date().toISOString(),
		});

		// remove the pending state

		chatStore.setIsAssistantResponsePending(false);
	};

	return sendMessage;
};
