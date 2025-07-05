import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { WorkspaceLayout } from "./types";

export interface WorkspaceStore {
	layout: WorkspaceLayout | null;
	setLayout: (workspace: WorkspaceLayout | null) => void;
	setIsPrimarySidebarOpen: (isOpen: boolean) => void;
	setIsSecondarySidebarOpen: (isOpen: boolean) => void;
}

export const useWorkspaceStore = create(
	immer<WorkspaceStore>((set) => ({
		layout: null,
		setLayout: (workspace) => {
			set(() => ({
				workspace,
			}));
		},
		setIsPrimarySidebarOpen: (isOpen) => {
			set((state) => {
				if (!state.layout) {
					return;
				}

				state.layout.primarySidebar.isOpen = isOpen;
			});
		},
		setIsSecondarySidebarOpen: (isOpen) => {
			set((state) => {
				if (!state.layout) {
					return;
				}

				state.layout.secondarySidebar.isOpen = isOpen;
			});
		},
	}))
);
