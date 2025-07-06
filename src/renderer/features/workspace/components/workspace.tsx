import { useShallow } from "zustand/shallow";
import { ChatListView } from "../../chat/components/chat-list-view";
import { useWorkspaceStore } from "../stores";
import { SideDock } from "./side-dock";
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
				<SideDock />
				{isPrimarySidebarOpen && (
					<div
						className="primary-sidebar"
						style={{ width: workspaceStore.primarySidebar.width }}
					>
						<ChatListView />
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
