import { useCallback, useRef } from "react";
import { ulid } from "ulid";
import type * as limbo from "@limbo/api";
import { useMainRouterClient } from "../../../lib/trpc";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { usePluginManager } from "../../plugins/hooks/core";
import { handleAssistantChatLoop } from "../core/chat-loop";
import { ChatMessageBuilder, ChatPromptBuilder } from "../core/chat-prompt-builder";
import { createStoreConnectedMessageHandle } from "../core/utils";
import { useChatStore } from "../stores";

export interface SendMessageOptions {
	llm: limbo.LLM;
	chatId: string;
	systemPrompt: string;
	enabledToolIds: string[];
	message: string;
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();
	const abortControllers = useRef<Map<string, AbortController>>(new Map());

	const sendMessage = useCallback(
		async ({ llm, chatId, systemPrompt, message, enabledToolIds }: SendMessageOptions) => {
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
			promptBuilder.setSystemPrompt(systemPrompt);

			const userMessageId = ulid();
			const userMessageCreatedAt = new Date().toISOString();

			const userMessage = new ChatMessageBuilder({
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

			const assistantMessage = new ChatMessageBuilder({
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

			const assistantMessageHandle = createStoreConnectedMessageHandle({
				chatId,
				messageId: assistantMessageId,
				messageBuilder: assistantMessage,
			});

			// run the plugins on the onPrepareChatPrompt lifecycle hook
			await pluginManager.executeOnPrepareChatPromptHooks({
				chatId,
				promptBuilder,
			});

			try {
				await handleAssistantChatLoop({
					chatId,
					llm,
					pluginManager,
					chatPrompt: promptBuilder,
					messageHandle: assistantMessageHandle,
					tools: toolMap,
					maxIterations: 25,
					abortSignal,
				});
			} catch (error) {
				if (!(error instanceof Error) || error.name !== "AbortError") {
					chatStore.removeMessage(chatId, userMessageId);
					chatStore.removeMessage(chatId, assistantMessageId);

					chatStore.setIsResponsePending(chatId, false);

					throw error;
				}

				// otherwise, swallow the abort error
			}

			// mark the assistant message as complete
			chatStore.updateMessage(chatId, assistantMessageId, {
				role: "assistant",
				status: "complete",
				createdAt: new Date().toISOString(),
			});

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

			// remove the abort controller from the map
			abortControllers.current.delete(chatId);

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
