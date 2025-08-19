import type * as limbo from "@limbo/api";
import { useChatNodeStore } from "./stores";

export function addChatNode(id: string, chatNode: limbo.ui.ChatNode) {
	const chatNodeStore = useChatNodeStore.getState();

	chatNodeStore.addChatNode(id, chatNode);
}

export function removeChatNode(id: string) {
	const chatNodeStore = useChatNodeStore.getState();

	chatNodeStore.removeChatNode(id);
}
