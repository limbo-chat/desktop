import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { ulid } from "ulid";
import type * as limbo from "@limbo/api";
import { useMainRouter, useMainRouterClient } from "../../../lib/trpc";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { usePluginManager } from "../../plugins/hooks/core";
import { runChatGeneration } from "../core/chat-generation";
import { ChatPrompt, ChatMessage } from "../core/chat-prompt";
import { createStoreConnectedMessage } from "../core/utils";
import { useChatStore } from "../stores";

export interface SendMessageOptions {
	llm: limbo.LLM;
	chatId: string;
	enabledToolIds: string[];
	userMessage: ChatMessage;
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const queryClient = useQueryClient();

	const sendMessage = useCallback(
		async ({ llm, chatId, userMessage, enabledToolIds }: SendMessageOptions) => {
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

			await mainRouterClient.chats.update.mutate({
				id: chatId,
				data: {
					lastActivityAt: assistantMessageCreatedAt,
				},
			});

			queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());

			// create a new prompt
			const prompt = new ChatPrompt();

			// add the user message to the prompt
			prompt.appendMessage(userMessage);

			// create the empty assistant message
			const assistantMessage = new ChatMessage("assistant");

			prompt.appendMessage(assistantMessage);

			// add the assistant message to the chat store
			const statefulAssistantMessage = createStoreConnectedMessage({
				chatId,
				messageId: assistantMessageId,
				message: assistantMessage,
			});

			// create the generation object
			const generation: limbo.ChatGeneration = {
				chatId,
				llm,
				prompt,
				assistantMessage: statefulAssistantMessage,
				iterations: [],
			};

			try {
				await runChatGeneration({
					generation,
					pluginManager,
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
