import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type * as limbo from "limbo";
import type { ChatMessageType } from "./types";

export interface ChatStore {
	messages: ChatMessageType[];
	userHasSentMessage: boolean;
	isAssistantResponsePending: boolean;
	setUserHasSentMessage: (userHasSentMessage: boolean) => void;
	setIsAssistantResponsePending: (isResponsePending: boolean) => void;
	getMessage: (messageId: string) => ChatMessageType | undefined;
	addMessage: (message: ChatMessageType) => void;
	updateMessage: (messageId: string, partialMessage: Partial<ChatMessageType>) => void;
	addNodeToMessage: (messageId: string, node: limbo.ChatMessageNode) => void;
	setMessageNodes: (messageId: string, nodes: limbo.ChatMessageNode[]) => void;
	removeMessage: (messageId: string) => void;
	reset: () => void;
}

export const useChatStore = create(
	immer<ChatStore>((set, get) => ({
		messages: [],
		userHasSentMessage: false,
		isAssistantResponsePending: false,
		setUserHasSentMessage: (userHasSentMessage) => {
			set({ userHasSentMessage });
		},
		setIsAssistantResponsePending: (isResponsePending) => {
			set({ isAssistantResponsePending: isResponsePending });
		},
		getMessage: (messageId) => {
			const state = get();

			return state.messages.find((message) => message.id === messageId);
		},
		addMessage: (message) => {
			set((state) => {
				state.messages.push(message);
			});
		},
		updateMessage: (messageId, partialMessage) => {},
		addNodeToMessage: (messageId, node) => {
			set((state) => {
				const message = state.messages.find((msg) => msg.id === messageId);

				if (!message) {
					return;
				}

				message.content.push(node);
			});
		},
		setMessageNodes: (messageId, nodes) => {
			set((state) => {
				const message = state.messages.find((msg) => msg.id === messageId);

				if (!message) {
					return;
				}

				message.content = nodes;
			});
		},
		removeMessage: (messageId) => {
			set((state) => {
				state.messages = state.messages.filter((message) => message.id !== messageId);
			});
		},
		reset: () => {
			set((state) => {
				state.messages = [];
				state.userHasSentMessage = false;
				state.isAssistantResponsePending = false;
			});
		},
	}))
);
