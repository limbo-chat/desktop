import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LocalStore {
	selectedChatLLMId: string | null;
	enabledToolIds: string[];
	setSelectedChatLLMId: (llmId: string | null) => void;
	setEnabledToolIds: (toolIds: string[]) => void;
}

export const useLocalStore = create(
	persist<LocalStore>(
		(set) => ({
			selectedChatLLMId: null,
			enabledToolIds: [],
			setEnabledToolIds: (tools) => set({ enabledToolIds: tools }),
			setSelectedChatLLMId: (llmId) => set({ selectedChatLLMId: llmId }),
		}),
		{
			name: "local-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
