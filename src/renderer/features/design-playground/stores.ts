import { create } from "zustand";

export interface DesignPlaygroundTabsStore {
	activeTab: string | null;
	setActiveTab: (tab: string | null) => void;
}

export const useDesignPlaygroundTabsStore = create<DesignPlaygroundTabsStore>((set) => ({
	activeTab: null,
	setActiveTab: (tab) => {
		set({ activeTab: tab });
	},
}));
