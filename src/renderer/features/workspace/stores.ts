import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Workspace } from "../../../main/workspace/schemas";

export interface WorkspaceStore {
	workspace: Workspace | null;
	setWorkspace: (workspace: Workspace | null) => void;
	setIsPrimarySidebarOpen: (isOpen: boolean) => void;
	setIsSecondarySidebarOpen: (isOpen: boolean) => void;
}

export const useWorkspaceStore = create(
	immer<WorkspaceStore>((set) => ({
		workspace: null,
		setWorkspace: (workspace) => {
			set(() => ({
				workspace,
			}));
		},
		setIsPrimarySidebarOpen: (isOpen) => {
			set((state) => {
				if (!state.workspace) {
					return;
				}

				state.workspace.layout.primarySidebar.isOpen = isOpen;
			});
		},
		setIsSecondarySidebarOpen: (isOpen) => {
			set((state) => {
				if (!state.workspace) {
					return;
				}

				state.workspace.layout.secondarySidebar.isOpen = isOpen;
			});
		},
	}))
);
