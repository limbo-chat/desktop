import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LocalStore {
	selectedModel: string | null;
	setSelectedModel: (model: string | null) => void;
}

export const useLocalStore = create(
	persist<LocalStore>(
		(set) => ({
			selectedModel: null,
			setSelectedModel: (model) => set({ selectedModel: model }),
		}),
		{
			name: "local-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
