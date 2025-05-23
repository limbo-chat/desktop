import { ulid } from "ulid";
import { useMainRouterClient } from "../../../lib/trpc";
import { usePluginManager } from "../../plugins/hooks";
import { useLocalStore } from "../../storage/stores";
import { PromptBuilder } from "../core/prompt-builder";
import { useChatStore } from "../stores";

export interface SendMessageOptions {
	chatId: string;
	message: string;
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();

	const sendMessage = async ({ chatId, message }: SendMessageOptions) => {
		const localStore = useLocalStore.getState();
		const chatStore = useChatStore.getState();

		if (!localStore.selectedModel) {
			return;
		}

		const llm = pluginManager.getLLM(localStore.selectedModel);

		if (!llm) {
			// TODO, indicate some error
			return;
		}

		chatStore.setIsAssistantResponsePending(true);

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

		const assistantMessageId = ulid();

		chatStore.addMessage({
			id: assistantMessageId,
			role: "assistant",
			status: "pending",
			content: [],
			createdAt: new Date().toISOString(),
		});

		const promptBuilder = new PromptBuilder();

		promptBuilder.appendMessage({
			role: "user",
			content: message,
		});

		await pluginManager.executeOnBeforeGenerateTextHooks({
			chatId,
			promptBuilder,
		});

		let responseText = "";

		try {
			await llm.generateText({
				promptBuilder: promptBuilder,
				onChunk: (chunk) => {
					responseText += chunk;

					chatStore.addTextToMessage(assistantMessageId, chunk);
				},
			});
		} catch (error) {
			chatStore.removeMessage(userMessageId);
			chatStore.removeMessage(assistantMessageId);

			chatStore.setIsAssistantResponsePending(false);

			throw error;
		}

		chatStore.updateMessage(assistantMessageId, {
			role: "assistant",
			status: "complete",
			createdAt: new Date().toISOString(),
		});

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
			content: [
				{
					type: "text",
					text: responseText,
				},
			],
			createdAt: new Date().toISOString(),
		});

		chatStore.setIsAssistantResponsePending(false);
	};

	return sendMessage;
};
