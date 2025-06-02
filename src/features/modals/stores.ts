import type { ReactNode } from "@tanstack/react-router";
import { create } from "zustand";

export interface Modal {
	className?: string;
	content: ReactNode;
}

export interface ModalStore {
	activeModal: Modal | null;
	setActiveModal: (modal: Modal | null) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	activeModal: null,
	setActiveModal: (modal) => set({ activeModal: modal }),
}));
