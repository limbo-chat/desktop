import { useLocalStore } from "./stores";

export const useSelectedChatLLMId = () => {
	return useLocalStore((state) => state.selectedChatLLMId);
};

export const useEnabledToolIds = () => {
	return useLocalStore((state) => state.enabledToolIds);
};
