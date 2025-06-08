import Ajv from "ajv";
import { ulid } from "ulid";
import type * as limbo from "limbo";
import { useMainRouterClient } from "../../../lib/trpc";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { usePluginManager } from "../../plugins/hooks/core";
import { useToolCallStore } from "../../tools/stores";
import { ChatPromptBuilder } from "../core/chat-prompt-builder";
import { useChatStore } from "../stores";

export interface SendMessageOptions {
	llm: limbo.LLM;
	chatId: string;
	message: string;
	enabledToolIds: string[];
}

const ajv = new Ajv();

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();

	const sendMessage = async ({ llm, chatId, message, enabledToolIds }: SendMessageOptions) => {
		const chatStore = useChatStore.getState();
		const toolCallStore = useToolCallStore.getState();

		if (!chatStore.userHasSentMessage) {
			chatStore.setUserHasSentMessage(true);
		}

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
					data: {
						content: message,
					},
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

		const userMessage = promptBuilder.createMessage({
			role: "user",
			content: [
				{
					type: "text",
					data: {
						content: message,
					},
				},
			],
		});

		// add the user message to the prompt builder
		promptBuilder.appendMessage(userMessage);

		// run the plugins on the onPrepareChatPrompt lifecycle hook
		await pluginManager.executeOnPrepareChatPromptHooks({
			chatId,
			promptBuilder,
		});

		// run the plugins on the onTransformChatPrompt lifecycle hook
		await pluginManager.executeOnTransformChatPromptHooks({
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

				if (enabledToolIds.includes(namespacedToolId)) {
					toolMap.set(namespacedToolId, tool);

					toolDefinitions.push({
						id: namespacedToolId,
						description: tool.description,
						schema: tool.schema,
					});
				}
			}
		}

		const assistantMessageChatNodes: limbo.ChatMessageNode[] = [];
		const finalToolCalls: limbo.LLM.ToolCall[] = [];

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

				await llm.chat({
					tools: toolDefinitions,
					messages: promptBuilder.toPromptMessages(),
					onText: (text) => {
						completeResponseText += text;

						const assistantMessage = chatStore.getMessage(assistantMessageId);

						// it should always be there, but just in case
						if (!assistantMessage) {
							return;
						}

						const lastNode =
							assistantMessage.content[assistantMessage.content.length - 1];

						if (lastNode && lastNode.type === "markdown") {
							chatStore.updateMessageNode(
								assistantMessageId,
								assistantMessage.content.length - 1,
								{
									data: {
										content: completeResponseText,
									},
								}
							);
						} else {
							chatStore.addNodeToMessage(assistantMessageId, {
								type: "markdown",
								data: {
									content: completeResponseText,
								},
							});
						}
					},
					onToolCall: (toolCall) => {
						toolCalls.push(toolCall);
					},
				});

				if (completeResponseText.length > 0) {
					assistantMessageChatNodes.push({
						type: "markdown",
						data: {
							content: completeResponseText,
						},
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

							// add the tool call to the store in the pending state
							toolCallStore.addToolCall({
								id: callId,
								status: "pending",
								arguments: toolCall.arguments,
								toolId: toolCall.toolId,
							});

							// add the tool call reference to the assistant message
							chatStore.addNodeToMessage(assistantMessageId, {
								type: "tool_call",
								data: {
									tool_call_id: callId,
								},
							});

							// validate the tool call arguments
							const validateArguments = ajv.compile(tool.schema);
							const areArgumentsValid = validateArguments(toolCall.arguments);

							let finalToolCall: limbo.ToolCall;

							if (areArgumentsValid) {
								try {
									const result = await tool.execute(toolCall.arguments);

									finalToolCall = {
										id: callId,
										toolId: toolCall.toolId,
										arguments: toolCall.arguments,
										status: "success",
										result,
									};
								} catch (error) {
									let errorMessage = null;

									if (error instanceof Error) {
										errorMessage = error.message;
									}

									finalToolCall = {
										id: callId,
										toolId: toolCall.toolId,
										arguments: toolCall.arguments,
										status: "error",
										error: errorMessage,
									};
								}
							} else {
								finalToolCall = {
									id: callId,
									toolId: toolCall.toolId,
									arguments: toolCall.arguments,
									status: "error",
									error: "Invalid arguments",
								};
							}

							// 1) Update the tool call node in the store with the final result
							toolCallStore.addToolCall(finalToolCall);

							// add the final tool call to the list of final tool calls
							finalToolCalls.push(finalToolCall);

							// 2) add the tool call node to the assistant message

							assistantMessageChatNodes.push({
								type: "tool_call",
								data: {
									tool_call_id: finalToolCall.id,
								},
							});

							// 3) Add the tool call to the prompt builder for subsequent generations

							let resultStr;

							if (finalToolCall.status === "success") {
								resultStr = finalToolCall.result;
							} else {
								resultStr = `Error: ${finalToolCall.error ?? "Unknown error"}`;
							}

							const finalAssistantMessage = promptBuilder.createMessage({
								role: "assistant",
								content: [
									{
										type: "tool_call",
										// @ts-expect-error
										data: finalToolCall,
									},
								],
							});

							promptBuilder.appendMessage(finalAssistantMessage);
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

		// save the final tool calls to the database
		await Promise.all(
			finalToolCalls.map(async (finalToolCall) => {
				// @ts-ignore TEMP IGNORE
				await mainRouter.toolCalls.create.mutate(finalToolCall);
			})
		);

		// save the user message and final assistant message to the database
		// note: we wait to do this until the end to avoid saving incomplete messages
		await mainRouter.chats.messages.create.mutate({
			id: userMessageId,
			role: "user",
			content: [
				{
					type: "text",
					data: {
						content: message,
					},
				},
			],
			chatId: chatId,
			createdAt: userMessageCreatedAt,
		});

		// save the assistant message
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
