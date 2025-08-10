import type * as limbo from "@limbo/api";
import { create } from "zustand";

export interface ChatNodeStore {
	chatNodes: Map<string, limbo.ui.ChatNode>;
	addChatNode: (chatNodeId: string, chatNode: limbo.ui.ChatNode) => void;
	removeChatNode: (chatNodeId: string) => void;
}

export const useChatNodeStore = create<ChatNodeStore>((set) => ({
	chatNodes: new Map(),
	addChatNode: (chatNodeId, chatNode) => {
		set((state) => {
			const newChatNodes = new Map(state.chatNodes);

			newChatNodes.set(chatNodeId, chatNode);

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
