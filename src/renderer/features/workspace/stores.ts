import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Workspace } from "../../../main/workspace/schemas";

export interface WorkspaceStore {
	workspace: Workspace | null;
	setWorkspace: (workspace: Workspace | null) => void;
	setActiveChatId: (chatId: string | null) => void;
	setIsPrimarySidebarOpen: (isOpen: boolean) => void;
	setIsSecondarySidebarOpen: (isOpen: boolean) => void;
	setPrimarySidebarWidth: (width: number) => void;
	setSecondarySidebarWidth: (width: number) => void;
}

export const useWorkspaceStore = create(
	immer<WorkspaceStore>((set) => ({
		workspace: null,
		setWorkspace: (workspace) => {
			set(() => ({
				workspace,
			}));
		},
		setActiveChatId: (chatId) => {
			set((state) => {
				if (!state.workspace) {
					return;
				}

				state.workspace.activeChatId = chatId;
			});
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
		setPrimarySidebarWidth: (width) => {
			set((state) => {
				if (!state.workspace) {
					return;
				}

				state.workspace.layout.primarySidebar.width = width;
			});
		},
		setSecondarySidebarWidth: (width) => {
			set((state) => {
				if (!state.workspace) {
					return;
				}

				state.workspace.layout.secondarySidebar.width = width;
			});
		},
	}))
);

export interface EphemeralWorkspaceStore {
	isResizing: boolean;
	setIsResizing: (isResizing: boolean) => void;
}

export const useEphemeralWorkspaceStore = create<EphemeralWorkspaceStore>((set) => ({
	isResizing: false,
	setIsResizing: (isResizing) => {
		set({
			isResizing,
		});
	},
}));
