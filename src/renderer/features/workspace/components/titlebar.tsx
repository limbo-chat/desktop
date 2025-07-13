import { useShallow } from "zustand/shallow";
import { AppIcon } from "../../../components/app-icon";
import { IconButton } from "../../../components/icon-button";
import { useMainRouterClient } from "../../../lib/trpc";
import { useCreateChatMutation } from "../../chat/hooks/queries";
import { useWindowInfoContext } from "../../window-info/hooks";
import { useWorkspaceStore } from "../stores";

const WindowControls = () => {
	const mainRouter = useMainRouterClient();

	return (
		<div className="window-controls">
			<IconButton action="minimize" onClick={() => mainRouter.window.minimize.mutate()}>
				<AppIcon icon="minimize" />
			</IconButton>
			<IconButton action="maximize" onClick={() => mainRouter.window.maximize.mutate()}>
				<AppIcon icon="maximize" />
			</IconButton>
			<IconButton action="close" onClick={() => mainRouter.window.close.mutate()}>
				<AppIcon icon="close" />
			</IconButton>
		</div>
	);
};

export const Titlebar = () => {
	const createChatMutation = useCreateChatMutation();
	const windowInfo = useWindowInfoContext();
	const shouldRenderControls = windowInfo.platform !== "macos";

	const workspaceStore = useWorkspaceStore(
		useShallow((state) => ({
			isPrimarySidebarOpen: state.workspace!.layout.primarySidebar.isOpen,
			isSecondarySidebarOpen: state.workspace!.layout.secondarySidebar.isOpen,
		}))
	);

	const togglePrimarySidebarIsOpen = () => {
		const workspaceState = useWorkspaceStore.getState();

		workspaceState.setIsPrimarySidebarOpen(!workspaceStore.isPrimarySidebarOpen);
	};

	const toggleSecondarySidebarIsOpen = () => {
		const workspaceState = useWorkspaceStore.getState();

		workspaceState.setIsSecondarySidebarOpen(!workspaceStore.isSecondarySidebarOpen);
	};

	const createNewChat = () => {
		createChatMutation.mutate({
			name: "New chat",
		});
	};

	return (
		<div className="titlebar">
			<div className="titlebar-section" data-section="start">
				<div className="titlebar-action-section">
					<IconButton
						action="toggle-primary-sidebar"
						onClick={togglePrimarySidebarIsOpen}
					>
						{workspaceStore.isPrimarySidebarOpen ? (
							<AppIcon icon="panel-left-close" />
						) : (
							<AppIcon icon="panel-left" />
						)}
					</IconButton>
					<IconButton action="create-new-chat" onClick={createNewChat}>
						<AppIcon icon="compose" />
					</IconButton>
				</div>
			</div>
			<div className="titlebar-section" data-section="center">
				{/* nothing for now */}
			</div>
			<div className="titlebar-section" data-section="end">
				<div className="titlebar-action-section">
					<IconButton
						action="toggle-secondary-sidebar"
						onClick={toggleSecondarySidebarIsOpen}
					>
						{workspaceStore.isSecondarySidebarOpen ? (
							<AppIcon icon="panel-right-close" />
						) : (
							<AppIcon icon="panel-right" />
						)}
					</IconButton>
				</div>
				{shouldRenderControls && <WindowControls />}
			</div>
		</div>
	);
};
