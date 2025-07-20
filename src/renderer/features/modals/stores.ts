import type { FC } from "react";
import { create } from "zustand";

export interface Modal {
	id: string;
	component: FC;
}

export interface ModalStore {
	modals: Modal[];
	addModal: (modal: Modal) => void;
	removeModal: (id: string) => void;
	removeTopModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	modals: [],
	addModal: (modal) => {
		set((state) => ({
			modals: [...state.modals, modal],
		}));
	},
	removeModal: (id) => {
		set((state) => ({
			modals: state.modals.filter((modal) => modal.id !== id),
		}));
	},
	removeTopModal: () => {
		set((state) => ({
			modals: state.modals.slice(0, -1),
		}));
	},
}));
