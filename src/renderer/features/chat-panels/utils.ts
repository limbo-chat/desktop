import type * as limbo from "@limbo-chat/api";
import { useChatPanelStore } from "./stores";

export function addChatPanel(id: string, chatPanel: limbo.ui.ChatPanel) {
	const chatPanelStore = useChatPanelStore.getState();

	chatPanelStore.addChatPanel(id, chatPanel);
}

export function removeChatPanel(id: string) {
	const chatPanelStore = useChatPanelStore.getState();

	chatPanelStore.removeChatPanel(id);
}
