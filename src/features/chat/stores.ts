import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ChatMessageType } from "./types";

export interface ChatStore {
	isAssistantResponsePending: boolean;
	messages: ChatMessageType[];
	setIsAssistantResponsePending: (isResponsePending: boolean) => void;
	addMessage: (message: ChatMessageType) => void;
	addChunkToLastMessage: (chunk: string) => void;
	updateLastMessage: (message: ChatMessageType) => void;
	reset: () => void;
}

export const useChatStore = create(
	immer<ChatStore>((set) => ({
		isAssistantResponsePending: false,
		messages: [],
		setIsAssistantResponsePending: (isResponsePending) =>
			set({ isAssistantResponsePending: isResponsePending }),
		addMessage: (message) =>
			set((state) => {
				state.messages.push(message);
			}),
		addChunkToLastMessage: (chunk) =>
			set((state) => {
				const lastMessage = state.messages[state.messages.length - 1];

				if (!lastMessage) {
					return;
				}

				lastMessage.content += chunk;
			}),
		updateLastMessage: (message) =>
			set((state) => {
				state.messages[state.messages.length - 1] = message;
			}),
		reset: () => {
			set((state) => {
				state.messages = [];
				state.isAssistantResponsePending = false;
			});
		},
	}))
);
