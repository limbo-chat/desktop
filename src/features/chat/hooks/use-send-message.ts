import { useCallback, useRef } from "react";
import { ulid } from "ulid";
import type * as limbo from "limbo";
import { useMainRouterClient } from "../../../lib/trpc";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { usePluginManager } from "../../plugins/hooks/core";
import { useToolCallStore } from "../../tools/stores";
import { ChatPromptBuilder } from "../core/chat-prompt-builder";
import { executeToolCall } from "../core/utils";
import { useChatStore } from "../stores";

interface HandleLLMToolCallOptions {
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

	const toolCallStore = useToolCallStore.getState();

	// add the initial tool call to the store with pending status
	toolCallStore.addToolCall({
		id: toolCallId,
		toolId: toolCall.toolId,
		arguments: toolCall.arguments,
		status: "pending",
	});

	// add the tool call to the message
	messageHandle.appendNode({
		type: "tool_call",
		data: {
			tool_call_id: toolCallId,
		},
	});

	if (!tool) {
		const finalToolCall: limbo.ToolCall = {
			id: toolCallId,
			toolId: toolCall.toolId,
			arguments: toolCall.arguments,
			status: "error",
			error: "Tool not found",
		};

		toolCallStore.addToolCall(finalToolCall);

		return finalToolCall;
	}

	toolCallStore.addToolCall({
		id: toolCallId,
		status: "pending",
		arguments: toolCall.arguments,
		toolId: toolCall.toolId,
	});

	const toolCallResult = await executeToolCall({
		tool,
		args: toolCall.arguments,
		messageHandle,
		abortSignal: abortSignal,
	});

	const finalToolCall: limbo.ToolCall = {
		id: toolCallId,
		toolId: toolCall.toolId,
		arguments: toolCall.arguments,
		...toolCallResult,
	};

	toolCallStore.addToolCall(finalToolCall);

	return finalToolCall;
}

export interface SendMessageOptions {
	llm: limbo.LLM;
	chatId: string;
	message: string;
	enabledToolIds: string[];
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();
	const abortControllers = useRef<Map<string, AbortController>>(new Map());

	const sendMessage = useCallback(
		async ({ llm, chatId, message, enabledToolIds }: SendMessageOptions) => {
			const chatStore = useChatStore.getState();
			const chatState = chatStore.chats[chatId];

			if (!chatState) {
				return;
			}

			if (chatState.isAssistantResponsePending) {
				return;
			}

			// create a new abort controller for this chat
			const abortController = new AbortController();

			// store the abort controller in the map
			abortControllers.current.set(chatId, abortController);

			const abortSignal = abortController.signal;

			if (!chatState.userHasSentMessage) {
				chatStore.setUserHasSentMessage(chatId, true);
			}

			// trigger the loading state
			chatStore.setIsResponsePending(chatId, true);

			// create a new prompt builder
			const promptBuilder = new ChatPromptBuilder();

			// set the default chat system prompt
			promptBuilder.setSystemPrompt(
				"Answer the user's request using relevant tools (if they are available). Before calling a tool, think about which of the provided tools is the relevant tool to answer the user's request. Ensure tools are called in parallel if possible."
			);

			const userMessageId = ulid();
			const userMessageCreatedAt = new Date().toISOString();

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

			// add user message to the chat store
			chatStore.addMessage(chatId, {
				role: "user",
				id: userMessageId,
				content: userMessage.getNodes(),
				createdAt: userMessageCreatedAt,
			});

			const assistantMessageId = ulid();

			const assistantMessage = promptBuilder.createMessage({
				role: "assistant",
				content: [],
			});

			// add the assistant message to the chat store
			chatStore.addMessage(chatId, {
				id: assistantMessageId,
				role: "assistant",
				status: "pending",
				content: assistantMessage.getNodes(),
				createdAt: new Date().toISOString(),
			});

			// create a prompt builder and add the user's message to it
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

			const messageHandle: limbo.MessageHandle = {
				getNode: (index) => {
					return assistantMessage.getNode(index);
				},
				getNodes: () => {
					return assistantMessage.getNodes();
				},
				prependNode: (node) => {
					assistantMessage.prependNode(node);

					chatStore.setMessageNodes(
						chatId,
						assistantMessageId,
						structuredClone(assistantMessage.getNodes())
					);
				},
				appendNode: (node) => {
					assistantMessage.appendNode(node);

					chatStore.setMessageNodes(
						chatId,
						assistantMessageId,
						structuredClone(assistantMessage.getNodes())
					);
				},
				removeNode: (node) => {
					assistantMessage.removeNode(node);

					chatStore.setMessageNodes(
						chatId,
						assistantMessageId,
						structuredClone(assistantMessage.getNodes())
					);
				},
				removeNodeAt: (index) => {
					assistantMessage.removeNodeAt(index);

					chatStore.setMessageNodes(
						chatId,
						assistantMessageId,
						structuredClone(assistantMessage.getNodes())
					);
				},
				replaceNode: (index, node) => {
					assistantMessage.replaceNode(index, node);

					chatStore.setMessageNodes(
						chatId,
						assistantMessageId,
						structuredClone(assistantMessage.getNodes())
					);
				},
				replaceNodeAt(index, newNodeOrNodes) {
					assistantMessage.replaceNodeAt(index, newNodeOrNodes);

					chatStore.setMessageNodes(
						chatId,
						assistantMessageId,
						structuredClone(assistantMessage.getNodes())
					);
				},
			};

			const finalToolCalls: limbo.LLM.ToolCall[] = [];

			try {
				// generate the assistant's response

				// let shouldLoop = true;
				let shouldLoop = true;
				let iterations = 0;

				let hasAppendedAssistantMessage = false;

				// max iterations to prevent catastrophic infinite loops
				while (shouldLoop && iterations < 25 && !abortSignal.aborted) {
					shouldLoop = false;

					let currentMarkdownNode: limbo.ChatMessageNode | null = null;

					const toolCallPromises: Promise<limbo.LLM.ToolCall>[] = [];

					await llm.chat({
						tools: toolDefinitions,
						messages: promptBuilder.toPromptMessages(),
						message: messageHandle,
						abortSignal: abortSignal,
						onText: (text) => {
							if (currentMarkdownNode) {
								currentMarkdownNode.data.content += text;
							} else {
								// create a new markdown node
								currentMarkdownNode = {
									type: "markdown",
									data: {
										content: text,
									},
								};

								// add the node to the assistant message
								assistantMessage.appendNode(currentMarkdownNode);
							}

							// sync the assistant message with the chat store
							chatStore.setMessageNodes(
								chatId,
								assistantMessageId,
								structuredClone(assistantMessage.getNodes())
							);
						},
						onToolCall: (toolCall) => {
							shouldLoop = true;
							currentMarkdownNode = null;

							const toolCallPromise = handleLLMToolCall({
								tools: toolMap,
								toolCall,
								messageHandle,
								abortSignal,
							});

							toolCallPromises.push(toolCallPromise);
						},
					});

					if (!hasAppendedAssistantMessage) {
						// add the assistant message to the prompt builder after the first generation
						promptBuilder.appendMessage(assistantMessage);

						hasAppendedAssistantMessage = true;
					}

					// wait for all tool calls to finish executing
					const settledToolCalls = await Promise.all(toolCallPromises);

					// add the tool calls to the prompt builder
					finalToolCalls.push(...settledToolCalls);

					iterations++;
				}
			} catch (error) {
				if (!(error instanceof Error) || error.name !== "AbortError") {
					chatStore.removeMessage(chatId, userMessageId);
					chatStore.removeMessage(chatId, assistantMessageId);

					chatStore.setIsResponsePending(chatId, false);

					throw error;
				}

				// otherwise, swallow the abort error
			}

			// remove the abort controller from the map
			abortControllers.current.delete(chatId);

			// mark the assistant message as complete
			chatStore.updateMessage(chatId, assistantMessageId, {
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
				chatId: chatId,
				role: "user",
				content: userMessage.getNodes(),
				createdAt: userMessageCreatedAt,
			});

			// save the assistant message
			await mainRouter.chats.messages.create.mutate({
				id: assistantMessageId,
				chatId: chatId,
				role: "assistant",
				content: assistantMessage.getNodes(),
				createdAt: new Date().toISOString(),
			});

			// remove the pending state
			chatStore.setIsResponsePending(chatId, false);
		},
		[]
	);

	const cancelResponse = useCallback((chatId: string) => {
		const abortController = abortControllers.current.get(chatId);

		if (!abortController) {
			return;
		}

		// abort the controller and remove it from the map
		abortController.abort();
	}, []);

	return {
		sendMessage,
		cancelResponse,
	};
};
