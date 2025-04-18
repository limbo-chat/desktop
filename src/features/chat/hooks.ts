import { useEffect } from "react";
import { useChatStore } from "./stores";
import { useMainRouterClient } from "../../lib/trpc";

export const useChatMessages = () => {
	return useChatStore((state) => state.messages);
};

export const useLLMChunkSubscriber = () => {
	useEffect(() => {
		const chatStore = useChatStore.getState();

		function onLLMCompletionChunk(e: any, data: any) {
			chatStore.addChunkToMessage(data.text);
		}

		window.ipcRenderer.on("llm-chunk", onLLMCompletionChunk);

		return () => {
			window.ipcRenderer.off("llm-chunk", onLLMCompletionChunk);
		};
	}, []);
};

export const useSendMessage = () => {
	const mainRouter = useMainRouterClient();
	const chatStoreState = useChatStore.getState();

	const sendMessage = async (message: string) => {
		const newUserMessage = await mainRouter.chats.messages.create.mutate({
			role: "user",
			content: message,
			chat_id: 1,
			created_at: new Date().toISOString(),
		});

		chatStoreState.addMessage({
			role: "user",
			id: newUserMessage.id,
			content: newUserMessage.content,
		});

		chatStoreState.setIsResponsePending(true);

		// TODO, really implement generateText
		// const generatedText = await llm.generateText();
		const generatedText = "***assistant***.";

		const newAssistantMessage = await mainRouter.chats.messages.create.mutate({
			role: "assistant",
			content: generatedText,
			chat_id: 1,
			created_at: new Date().toISOString(),
		});

		chatStoreState.setIsResponsePending(false);

		chatStoreState.addMessage({
			role: "assistant",
			id: newAssistantMessage.id,
			content: newAssistantMessage.content,
		});
	};

	return sendMessage;
};
