import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ChatMessageType } from "./types";

export interface ChatStore {
	isAssistantResponsePending: boolean;
	messages: ChatMessageType[];
	setIsAssistantResponsePending: (isResponsePending: boolean) => void;
	addMessage: (message: ChatMessageType) => void;
	updateMessage: (messageId: string, partialMessage: Partial<ChatMessageType>) => void;
	removeMessage: (messageId: string) => void;
	reset: () => void;
}

export const useChatStore = create(
	immer<ChatStore>((set) => ({
		messages: [],
		isAssistantResponsePending: false,
		setIsAssistantResponsePending: (isResponsePending) => {
			set({ isAssistantResponsePending: isResponsePending });
		},
		addMessage: (message) => {
			set((state) => {
				state.messages.push(message);
			});
		},
		removeMessage: (messageId) => {
			set((state) => {
				state.messages = state.messages.filter((state) => state.id !== messageId);
			});
		},
		// it sucks to have to find the index of the message to update
		updateMessage: (messageId, partialMessage) => {
			set((state) => {
				const messageIndex = state.messages.findIndex(
					(message) => message.id === messageId
				);

				if (messageIndex === -1) {
					return;
				}

				const prevMessage = state.messages[messageIndex];

				// @ts-expect-error
				state.messages[messageIndex] = {
					...prevMessage,
					...partialMessage,
				};
			});
		},
		reset: () => {
			set((state) => {
				state.messages = [];
				state.isAssistantResponsePending = false;
			});
		},
	}))
);
