import { useEffect } from "react";
import { useChatStore } from "./stores";

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
