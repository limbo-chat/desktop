import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type * as limbo from "limbo";
import type { ChatMessageType } from "./types";

export interface ChatState {
	messages: ChatMessageType[];
	userHasSentMessage: boolean;
	isAssistantResponsePending: boolean;
}

export interface ChatStore {
	chats: Record<string, ChatState>;
	recentChats: string[];
	addChat: (chatId: string, chatLimit?: number) => void;
	removeChat: (chatId: string) => void;
	setIsResponsePending: (chatId: string, isPending: boolean) => void;
	setUserHasSentMessage: (chatId: string, hasSent: boolean) => void;
	addMessage: (chatId: string, message: ChatMessageType) => void;
	updateMessage: (
		chatId: string,
		messageId: string,
		partialMessage: Partial<ChatMessageType>
	) => void;
	removeMessage: (chatId: string, messageId: string) => void;
	addNodeToMessage: (chatId: string, messageId: string, node: limbo.ChatMessageNode) => void;
	setMessageNodes: (chatId: string, messageId: string, nodes: limbo.ChatMessageNode[]) => void;
	reset: () => void;
}

export const useChatStore = create(
	immer<ChatStore>((set) => ({
		chats: {},
		recentChats: [],
		addChat: (chatId, chatLimit = 5) => {
			set((state) => {
				state.chats[chatId] = {
					isAssistantResponsePending: false,
					userHasSentMessage: false,
					messages: [],
				};

				state.recentChats.push(chatId);

				if (state.recentChats.length > chatLimit) {
					const lastChatId = state.recentChats.shift();

					if (lastChatId) {
						delete state.chats[lastChatId];
					}
				}
			});
		},
		removeChat: (chatId) => {
			set((state) => {
				delete state.chats[chatId];
			});
		},
		setUserHasSentMessage: (chatId, hasSent) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				chat.userHasSentMessage = hasSent;
			});
		},
		setIsResponsePending: (chatId, isPending) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				chat.isAssistantResponsePending = isPending;
			});
		},
		addMessage: (chatId, message) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				chat.messages.push(message);
			});
		},
		updateMessage: (chatId, messageId, partialMessage) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				const messageIdx = chat.messages.findIndex((msg) => msg.id === messageId);

				if (messageIdx === -1) {
					return;
				}

				const oldMessage = chat.messages[messageIdx];

				// @ts-expect-error
				chat.messages[messageIdx] = {
					...oldMessage,
					...partialMessage,
				};
			});
		},
		removeMessage: (chatId, messageId) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				chat.messages = chat.messages.filter((msg) => msg.id !== messageId);
			});
		},
		addNodeToMessage: (chatId, messageId, node) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				const message = chat.messages.find((msg) => msg.id === messageId);

				if (!message) {
					return;
				}

				message.content.push(node);
			});
		},
		setMessageNodes: (chatId, messageId, nodes) => {
			set((state) => {
				const chat = state.chats[chatId];

				if (!chat) {
					return;
				}

				const message = chat.messages.find((msg) => msg.id === messageId);

				if (!message) {
					return;
				}

				message.content = nodes;
			});
		},
		reset: () => {
			set((state) => {
				state.chats = {};
				state.recentChats = [];
			});
		},
	}))
);
