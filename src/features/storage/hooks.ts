import { useLocalStore } from "./stores";

export const useSelectedChatLLMId = () => {
	return useLocalStore((state) => state.selectedChatLLMId);
};

export const useEnabledTools = () => {
	return useLocalStore((state) => state.enabledToolIds);
};
