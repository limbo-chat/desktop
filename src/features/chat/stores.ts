import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ChatMessageType } from "./types";

export interface ChatStore {
	isAssistantResponsePending: boolean;
	assistantResponse: string | null;
	messages: ChatMessageType[];
	setIsResponsePending: (isResponsePending: boolean) => void;
	addMessage: (message: ChatMessageType) => void;
	addChunkToAssistantResponse: (chunk: string) => void;
	clearAssistantResponse: () => void;
	reset: () => void;
}

export const useChatStore = create(
	immer<ChatStore>((set) => ({
		isAssistantResponsePending: false,
		assistantResponse: null,
		messages: [],
		setIsResponsePending: (isResponsePending) =>
			set({ isAssistantResponsePending: isResponsePending }),
		addMessage: (message) =>
			set((state) => {
				state.messages.push(message);
			}),
		addChunkToAssistantResponse: (chunk) =>
			set((state) => {
				if (!state.assistantResponse) {
					state.assistantResponse = chunk;
				} else {
					state.assistantResponse += chunk;
				}
			}),
		clearAssistantResponse: () => set({ assistantResponse: null }),
		reset: () => {
			set((state) => {
				state.messages = [];
				state.isAssistantResponsePending = false;
				state.assistantResponse = null;
			});
		},
	}))
);
