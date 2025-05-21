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

// TODO, if an error occurs, the user message should be removed

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();

	const sendMessage = async ({ chatId, message }: SendMessageOptions) => {
		const localStoreState = useLocalStore.getState();
		const chatStoreState = useChatStore.getState();

		if (!localStoreState.selectedModel) {
			return;
		}

		const llm = pluginManager.getLLM(localStoreState.selectedModel);

		if (!llm) {
			return;
		}

		chatStoreState.setIsAssistantResponsePending(true);

		const newUserMessage = await mainRouter.chats.messages.create.mutate({
			id: ulid(),
			role: "user",
			content: message,
			chatId: chatId,
			createdAt: new Date().toISOString(),
		});

		chatStoreState.addMessage({
			...newUserMessage,
			role: "user",
		});

		const assistantMessageId = ulid();

		chatStoreState.addMessage({
			id: assistantMessageId,
			role: "assistant",
			status: "pending",
			content: "", // content will initially be empty
			createdAt: new Date().toISOString(),
		});

		const promptBuilder = new PromptBuilder();

		await pluginManager.executeOnBeforeGenerateTextHooks({
			chatId,
			promptBuilder,
		});

		let responseText = "";

		await llm.generateText({
			promptBuilder: promptBuilder,
			onChunk: (chunk) => {
				responseText += chunk;

				// this may cause issues if the user switches chats while the response is being generated
				// may have to change to updating it by the ID
				chatStoreState.addChunkToLastMessage(chunk);
			},
		});

		const newAssistantMessage = await mainRouter.chats.messages.create.mutate({
			id: assistantMessageId,
			chatId: chatId,
			role: "assistant",
			content: responseText,
			createdAt: new Date().toISOString(),
		});

		chatStoreState.updateLastMessage({
			id: newAssistantMessage.id,
			role: "assistant",
			status: "complete",
			content: newAssistantMessage.content,
			createdAt: newAssistantMessage.createdAt,
		});

		chatStoreState.setIsAssistantResponsePending(false);
	};

	return sendMessage;
};
