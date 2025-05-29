import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type * as limbo from "limbo";
import type { ChatMessageType } from "./types";

export interface ChatStore {
	messages: ChatMessageType[];
	isAssistantResponsePending: boolean;
	setIsAssistantResponsePending: (isResponsePending: boolean) => void;
	getMessage: (messageId: string) => ChatMessageType | undefined;
	addMessage: (message: ChatMessageType) => void;
	updateMessage: (messageId: string, partialMessage: Partial<ChatMessageType>) => void;
	addNodeToMessage: (messageId: string, node: limbo.CoreChatMessageNode) => void;
	updateMessageNode: (
		messageId: string,
		nodeIdx: number,
		partialNode: Partial<limbo.CoreChatMessageNode>
	) => void;
	removeMessage: (messageId: string) => void;
	reset: () => void;
}

export const useChatStore = create(
	immer<ChatStore>((set, get) => ({
		messages: [],
		isAssistantResponsePending: false,
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
		removeMessage: (messageId) => {
			set((state) => {
				state.messages = state.messages.filter((message) => message.id !== messageId);
			});
		},
		updateMessage: (messageId, partialMessage) => {
			set((state) => {
				const messageIdx = state.messages.findIndex((message) => message.id === messageId);

				if (messageIdx === -1) {
					return;
				}

				const prevMessage = state.messages[messageIdx];

				// @ts-expect-error
				state.messages[messageIdx] = {
					...prevMessage,
					...partialMessage,
				};
			});
		},
		addNodeToMessage: (messageId, node) => {
			set((state) => {
				const message = state.messages.find((message) => message.id === messageId);

				if (!message) {
					return;
				}

				message.content.push(node);
			});
		},
		updateMessageNode: (messageId, nodeIdx, partialNode) => {
			set((state) => {
				const message = state.messages.find((message) => message.id === messageId);

				if (!message) {
					return;
				}

				const oldNode = message.content[nodeIdx];

				if (!oldNode) {
					return;
				}

				message.content[nodeIdx] = {
					...oldNode,
					...partialNode,
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
