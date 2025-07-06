import { create } from "zustand";

export interface SettingsTabsStore {
	activeTab: string | null;
	setActiveTab: (tab: string | null) => void;
}

export const useSettingsTabsStore = create<SettingsTabsStore>((set) => ({
	activeTab: null,
	setActiveTab: (tab) => {
		set({ activeTab: tab });
	},
}));
