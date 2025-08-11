import { useCallback } from "react";
import type * as limbo from "@limbo/api";
import { useQueryClient } from "@tanstack/react-query";
import { ulid } from "ulid";
import { type Assistant } from "../../../../main/assistants/schemas";
import { useMainRouter, useMainRouterClient } from "../../../lib/trpc";
import { renderSystemPrompt } from "../../assistants/utils";
import { usePluginManager } from "../../plugins/hooks/core";
import { useTools } from "../../tools/hooks";
import { runChatGeneration } from "../core/chat-generation";
import { ChatPrompt, ChatMessage } from "../core/chat-prompt";
import {
	polyfillPromptForLLM,
	transformBuiltInNodesInPrompt,
	createStoreConnectedMessage,
} from "../core/utils";
import { useChatStore } from "../stores";

export interface SendMessageOptions {
	chatId: string;
	assistant: Assistant;
	llm: limbo.LLM;
	enabledToolIds: string[];
	user: {
		username: string;
	};
	userMessage: ChatMessage;
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const queryClient = useQueryClient();
	const tools = useTools();

	const sendMessage = useCallback(
		async ({
			assistant,
			llm,
			chatId,
			enabledToolIds,
			user,
			userMessage,
		}: SendMessageOptions) => {
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

			// create an map containing the enabled tools
			const enabledToolMap = new Map<string, limbo.Tool>();

			for (const enabledToolId of enabledToolIds) {
				const tool = tools.get(enabledToolId);

				if (tool) {
					enabledToolMap.set(enabledToolId, tool);
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

			// construct the system message
			const systemMessage = new ChatMessage("system");

			const rendereredSystemPrompt = renderSystemPrompt(assistant.system_prompt, {
				user,
			});

			systemMessage.appendNode({
				type: "text",
				data: {
					content: rendereredSystemPrompt,
				},
			});

			prompt.appendMessage(systemMessage);

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
				await pluginManager.executeOnBeforeChatGenerationHooks({
					generation,
					abortSignal: abortController.signal,
				});

				await runChatGeneration({
					generation,
					tools: enabledToolMap,
					maxIterations: 25,
					abortSignal: abortController.signal,
					onBeforeIteration: async (iteration) => {
						await pluginManager.executeOnBeforeChatIterationHooks({
							iteration,
							generation,
							abortSignal: abortController.signal,
						});

						transformBuiltInNodesInPrompt(iteration.prompt);
						polyfillPromptForLLM(generation.llm, iteration.prompt);
					},
					onAfterIteration: async (iteration) => {
						await pluginManager.executeOnAfterChatIterationHooks({
							iteration,
							generation,
							abortSignal: abortController.signal,
						});
					},
				});

				await pluginManager.executeOnAfterChatGenerationHooks({
					generation,
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
