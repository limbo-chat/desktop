import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SelectedModel {
	pluginId: string;
	modelId: string;
}

export interface LocalStore {
	selectedModel: SelectedModel | null;
	setSelectedModel: (model: SelectedModel | null) => void;
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
