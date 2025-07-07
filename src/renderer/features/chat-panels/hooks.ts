import { useActiveChatPanelStore, useChatPanelStore } from "./stores";

export const useChatPanels = () => {
	return useChatPanelStore((state) => state.chatPanels);
};

export const useChatPanel = (chatPanelId: string) => {
	const chatPanels = useChatPanels();

	return chatPanels.get(chatPanelId);
};

export const useActiveChatPanel = () => {
	return useActiveChatPanelStore((state) => state.activeChatPanel);
};
