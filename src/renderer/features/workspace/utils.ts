import { useWorkspaceStore } from "./stores";

export function setActiveChatId(chatId: string | null) {
	const workspaceState = useWorkspaceStore.getState();

	workspaceState.setActiveChatId(chatId);
}
