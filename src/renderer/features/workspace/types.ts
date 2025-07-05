export interface SidebarState {
	isOpen: boolean;
}

export interface WorkspaceLayout {
	primarySidebar: SidebarState;
	secondarySidebar: SidebarState;
}
