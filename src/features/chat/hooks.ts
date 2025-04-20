import { ulid } from "ulid";
import { useChatStore } from "./stores";
import { useMainRouterClient } from "../../lib/trpc";
import { usePluginManager } from "../plugins/hooks";
import { useLocalStore } from "../storage/stores";
import { PromptBuilder } from "./core/prompt-builder";

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

		const plugin = pluginManager.getPlugin(localStoreState.selectedModel.pluginId);

		if (!plugin) {
			return;
		}

		const pluginLLMs = plugin.getRegisteredLLMs();
		const llm = pluginLLMs.find((llm) => llm.id === localStoreState.selectedModel!.modelId);

		if (!llm) {
			return;
		}

		chatStoreState.setIsAssistantResponsePending(true);

		const newUserMessage = await mainRouter.chats.messages.create.mutate({
			id: ulid(),
			role: "user",
			content: message,
			chat_id: chatId,
			created_at: new Date().toISOString(),
		});

		chatStoreState.addMessage({
			role: "user",
			content: newUserMessage.content,
			id: newUserMessage.id,
			createdAt: newUserMessage.created_at,
		});

		const assistantMessageId = ulid();

		chatStoreState.addMessage({
			id: assistantMessageId,
			role: "assistant",
			status: "pending",
			content: "", // content will initially be empty
			createdAt: new Date().toISOString(),
		});

		let responseText = "";

		// TODO: this is not a full implementation of how the prompt builder will be used

		const promptBuilder = new PromptBuilder({
			systemPrompt: "",
			userPrompt: message,
		});

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
			chat_id: chatId,
			role: "assistant",
			content: responseText,
			created_at: new Date().toISOString(),
		});

		chatStoreState.updateLastMessage({
			id: newAssistantMessage.id,
			role: "assistant",
			status: "complete",
			content: newAssistantMessage.content,
			createdAt: newAssistantMessage.created_at,
		});

		chatStoreState.setIsAssistantResponsePending(false);
	};

	return sendMessage;
};
