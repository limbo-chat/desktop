import type * as limbo from "@limbo-chat/api";
import { create } from "zustand";

export interface MarkdownElementStore {
	elements: Map<string, limbo.ui.MarkdownElement>;
	addElement: (elementId: string, element: limbo.ui.MarkdownElement) => void;
	removeElement: (elementId: string) => void;
}

export const useMarkdownElementStore = create<MarkdownElementStore>((set) => ({
	elements: new Map(),
	addElement: (elementId, element) => {
		set((state) => {
			const newElements = new Map(state.elements);

			newElements.set(elementId, element);

			return { elements: newElements };
		});
	},
	removeElement: (elementId) => {
		set((state) => {
			const newElements = new Map(state.elements);

			newElements.delete(elementId);

			return { elements: newElements };
		});
	},
}));
