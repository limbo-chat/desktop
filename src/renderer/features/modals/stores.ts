import type { FC } from "react";
import { create } from "zustand";

export interface Modal {
	className?: string;
	component: FC;
}

export interface ModalStore {
	activeModal: Modal | null;
	setActiveModal: (modal: Modal | null) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	activeModal: null,
	setActiveModal: (modal) => set({ activeModal: modal }),
}));
