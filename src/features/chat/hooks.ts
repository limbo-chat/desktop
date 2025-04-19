import { useChatStore } from "./stores";
import { useMainRouterClient } from "../../lib/trpc";
import { usePluginManager } from "../plugins/hooks";
import { useLocalStore } from "../storage/stores";

export const useChatMessages = () => {
	return useChatStore((state) => state.messages);
};

export interface SendMessageOptions {
	chatId: number;
	message: string;
}

export const useSendMessage = () => {
	const pluginManager = usePluginManager();
	const mainRouter = useMainRouterClient();

	const sendMessage = async ({ chatId, message }: SendMessageOptions) => {
		const localStoreState = useLocalStore.getState();
		const chatStoreState = useChatStore.getState();

		if (!localStoreState.selectedModel) {
			return;
		}

		const plugin = pluginManager.getPlugin(localStoreState.selectedModel.pluginId);

		if (!plugin) {
			return;
		}

		const pluginLLMs = plugin.getRegisteredLLMs();
		const llm = pluginLLMs.find((llm) => llm.id === localStoreState.selectedModel!.modelId);

		if (!llm) {
			return;
		}

		const newUserMessage = await mainRouter.chats.messages.create.mutate({
			role: "user",
			content: message,
			chat_id: chatId,
			created_at: new Date().toISOString(),
		});

		chatStoreState.addMessage({
			role: "user",
			id: newUserMessage.id,
			content: newUserMessage.content,
		});

		chatStoreState.setIsResponsePending(true);

		let responseText = "";

		await llm.generateText({
			onChunk: (chunk) => {
				responseText += chunk;

				chatStoreState.addChunkToAssistantResponse(chunk);
			},
		});

		chatStoreState.setIsResponsePending(false);
		chatStoreState.clearAssistantResponse();

		const newAssistantMessage = await mainRouter.chats.messages.create.mutate({
			chat_id: chatId,
			role: "assistant",
			content: responseText,
			created_at: new Date().toISOString(),
		});

		chatStoreState.addMessage({
			role: "assistant",
			id: newAssistantMessage.id,
			content: responseText,
		});
	};

	return sendMessage;
};
