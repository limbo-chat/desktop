import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ChatMessageType, ChatNode, ToolCallNode } from "./types";

export interface ChatStore {
	messages: ChatMessageType[];
	isAssistantResponsePending: boolean;
	setIsAssistantResponsePending: (isResponsePending: boolean) => void;
	getMessage: (messageId: string) => ChatMessageType | undefined;
	addMessage: (message: ChatMessageType) => void;
	addNodeToMessage: (messageId: string, node: ChatNode) => void;
	updateMessage: (messageId: string, partialMessage: Partial<ChatMessageType>) => void;
	addTextToMessage: (messageId: string, chunk: string) => void;
	updateToolCallNode: (
		messageId: string,
		toolCallId: string,
		partialToolCallNode: Partial<ToolCallNode>
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
		// it sucks to have to find the index of the message to update
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
		addTextToMessage: (messageId, chunk) => {
			set((state) => {
				const messageIndex = state.messages.findIndex(
					(message) => message.id === messageId
				);

				if (messageIndex === -1) {
					return;
				}

				const prevMessage = state.messages[messageIndex];
				const lastContent = prevMessage.content[prevMessage.content.length - 1];

				if (!lastContent || lastContent.type !== "text") {
					// create a new text node
					prevMessage.content.push({
						type: "text",
						text: chunk,
					});
				} else {
					// add to the existing text node
					lastContent.text += chunk;
				}
			});
		},
		updateToolCallNode: (messageId, toolCallId, partialToolCallNode) => {
			set((state) => {
				const message = state.messages.find((message) => message.id === messageId);

				if (!message) {
					return;
				}

				const toolCallNodeIdx = message.content.findIndex(
					(node) => node.type === "tool_call" && node.callId === toolCallId
				);

				if (toolCallNodeIdx === -1) {
					return;
				}

				const prevToolCallNode = message.content[toolCallNodeIdx] as ToolCallNode;

				// @ts-expect-error
				message.content[toolCallNodeIdx] = {
					...prevToolCallNode,
					...partialToolCallNode,
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
