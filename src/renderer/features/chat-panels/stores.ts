import { create } from "zustand";
import type * as limbo from "@limbo/api";

export interface ChatPanelStore {
	chatPanels: Map<string, limbo.ui.ChatPanel>;
	addChatPanel: (chatPanelId: string, chatPanel: limbo.ui.ChatPanel) => void;
	removeChatPanel: (chatPanelId: string) => void;
}

export const useChatPanelStore = create<ChatPanelStore>((set) => ({
	chatPanels: new Map(),
	addChatPanel: (chatPanelId, chatPanel) => {
		set((state) => {
			const newChatPanels = new Map(state.chatPanels);

			newChatPanels.set(chatPanelId, chatPanel);

			return { chatPanels: newChatPanels };
		});
	},
	removeChatPanel: (chatPanelId) => {
		set((state) => {
			const newChatPanels = new Map(state.chatPanels);

			newChatPanels.delete(chatPanelId);

			return { chatPanels: newChatPanels };
		});
	},
}));
