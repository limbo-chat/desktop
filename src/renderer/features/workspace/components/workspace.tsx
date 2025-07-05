import { useShallow } from "zustand/shallow";
import { useWorkspaceStore } from "../stores";
import { Titlebar } from "./titlebar";

export const Workspace = () => {
	const workspaceStore = useWorkspaceStore(
		useShallow((state) => ({
			primarySidebar: state.layout!.primarySidebar,
			secondarySidebar: state.layout!.secondarySidebar,
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
				{isPrimarySidebarOpen && <div className="primary-sidebar">test</div>}
				<div className="main">{/* <ChatView /> */}</div>
				{isSecondarySidebarOpen && <div className="secondary-sidebar">test</div>}
			</div>
		</div>
	);
};
