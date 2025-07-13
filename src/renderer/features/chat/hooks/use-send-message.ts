import { useCallback } from "react";
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
	userMessage: ChatMessageBuilder;
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouterClient = useMainRouterClient();

	const sendMessage = useCallback(
		async ({ llm, chatId, systemPrompt, userMessage, enabledToolIds }: SendMessageOptions) => {
			const chatStore = useChatStore.getState();
			const chatState = chatStore.chats[chatId];

			if (!chatState) {
				return;
			}

			if (chatState.isAssistantResponsePending) {
				return;
			}

			// store the abort controller in the map
			if (!chatState.userHasSentMessage) {
				chatStore.setUserHasSentMessage(chatId, true);
			}

			const abortController = new AbortController();

			chatStore.setAbortController(chatId, abortController);

			// trigger the loading state
			chatStore.setIsResponsePending(chatId, true);

			const plugins = pluginManager.getPlugins();
			const toolMap = new Map<string, limbo.Tool>();

			// gather tools from plugins
			for (const plugin of plugins) {
				const tools = plugin.context.getTools();

				for (const tool of tools) {
					const namespacedToolId = buildNamespacedResourceId(plugin.manifest.id, tool.id);

					if (enabledToolIds.includes(namespacedToolId)) {
						toolMap.set(namespacedToolId, {
							...tool,
							id: namespacedToolId,
						});
					}
				}
			}

			const userMessageId = ulid();
			const userMessageCreatedAt = new Date().toISOString();

			// add user message to the chat store
			chatStore.addMessage(chatId, {
				role: "user",
				id: userMessageId,
				content: userMessage.getNodes(),
				createdAt: userMessageCreatedAt,
			});

			await mainRouterClient.chats.messages.create.mutate({
				id: userMessageId,
				chatId: chatId,
				role: "user",
				content: userMessage.getNodes(),
				createdAt: userMessageCreatedAt,
			});

			const assistantMessageId = ulid();
			const assistantMessageCreatedAt = new Date().toISOString();

			chatStore.addMessage(chatId, {
				id: assistantMessageId,
				role: "assistant",
				status: "pending",
				content: [],
				createdAt: assistantMessageCreatedAt,
			});

			await mainRouterClient.chats.messages.create.mutate({
				id: assistantMessageId,
				chatId: chatId,
				role: "assistant",
				content: [],
				createdAt: assistantMessageCreatedAt,
			});

			// create a new prompt builder
			const promptBuilder = new ChatPromptBuilder();

			// set the default chat system prompt
			promptBuilder.setSystemPrompt(systemPrompt);

			// add the user message to the prompt builder
			promptBuilder.appendMessage(userMessage);

			const assistantMessage = new ChatMessageBuilder({
				role: "assistant",
				content: [],
			});

			// add the assistant message to the chat store
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
					abortSignal: abortController.signal,
				});
			} finally {
				chatStore.updateMessage(chatId, assistantMessageId, {
					role: "assistant",
					status: "complete",
					createdAt: new Date().toISOString(),
				});

				chatStore.setIsResponsePending(chatId, false);

				chatStore.setAbortController(chatId, null);

				// update the final assistant message content
				await mainRouterClient.chats.messages.update.mutate({
					id: assistantMessageId,
					data: {
						content: assistantMessage.getNodes(),
					},
				});
			}
		},
		[]
	);

	const cancelResponse = useCallback((chatId: string) => {
		const chatStore = useChatStore.getState();
		const chatState = chatStore.chats[chatId];

		if (chatState?.abortController) {
			chatState.abortController.abort();
		}
	}, []);

	return {
		sendMessage,
		cancelResponse,
	};
};
