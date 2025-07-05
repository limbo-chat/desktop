import { useShallow } from "zustand/shallow";
import { useWorkspaceStore } from "../stores";
import { Titlebar } from "./titlebar";

export const Workspace = () => {
	const workspaceStore = useWorkspaceStore(
		useShallow((state) => ({
			activeChatId: state.workspace!.activeChatId,
			primarySidebar: state.workspace!.layout.primarySidebar,
			secondarySidebar: state.workspace!.layout.secondarySidebar,
		}))
	);

	const isPrimarySidebarOpen = workspaceStore.primarySidebar.isOpen;
	const isSecondarySidebarOpen = workspaceStore.secondarySidebar.isOpen;

	return (
		<div
			className="workspace"
			data-is-primary-sidebar-open={isPrimarySidebarOpen}
			data-is-secondary-sidebar-open={isSecondarySidebarOpen}
		>
			<Titlebar />
			<div className="workspace-content">
				{isPrimarySidebarOpen && (
					<div
						className="primary-sidebar"
						style={{ width: workspaceStore.primarySidebar.width }}
					>
						test
					</div>
				)}
				<div className="main">{/* <ChatView /> */}</div>
				{isSecondarySidebarOpen && (
					<div
						className="secondary-sidebar"
						style={{ width: workspaceStore.secondarySidebar.width }}
					>
						test
					</div>
				)}
			</div>
		</div>
	);
};
