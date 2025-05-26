import { useLocalStore } from "./stores";

export function getSelectedChatLLMId() {
	return useLocalStore.getState().selectedChatLLMId;
}

export function setSelectedChatLLMId(llmId: string | null) {
	const localStore = useLocalStore.getState();

	localStore.setSelectedChatLLMId(llmId);
}

export function getEnabledToolIds() {
	return useLocalStore.getState().enabledToolIds;
}

export function setEnabledToolIds(enabledToolIds: string[]) {
	const localStore = useLocalStore.getState();

	localStore.setEnabledToolIds(enabledToolIds);
}
