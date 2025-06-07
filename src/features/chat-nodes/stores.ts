import { create } from "zustand";
import type * as limbo from "limbo";

export interface ChatNodeStore {
	chatNodes: Map<string, limbo.ui.ChatNode>;
	addChatNode: (chatNode: limbo.ui.ChatNode) => void;
	removeChatNode: (chatNodeId: string) => void;
}

export const useChatNodeStore = create<ChatNodeStore>((set) => ({
	chatNodes: new Map(),
	addChatNode: (chatNode) => {
		set((state) => {
			const newChatNodes = new Map(state.chatNodes);

			newChatNodes.set(chatNode.id, chatNode);

			return { chatNodes: newChatNodes };
		});
	},
	removeChatNode: (chatNodeId) => {
		set((state) => {
			const newChatNodes = new Map(state.chatNodes);

			newChatNodes.delete(chatNodeId);

			return { chatNodes: newChatNodes };
		});
	},
}));
