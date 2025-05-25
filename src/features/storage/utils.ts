import { useLocalStore } from "./stores";

export function setSelectedChatLLMId(llmId: string | null) {
	const localStore = useLocalStore.getState();

	localStore.setSelectedChatLLMId(llmId);
}

export function setEnabledToolIds(enabledToolIds: string[]) {
	const localStore = useLocalStore.getState();

	localStore.setEnabledToolIds(enabledToolIds);
}
