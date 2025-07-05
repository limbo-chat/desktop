import {
	MaximizeIcon,
	MinimizeIcon,
	PanelLeftCloseIcon,
	PanelLeftIcon,
	PanelRightCloseIcon,
	PanelRightIcon,
	XIcon,
} from "lucide-react";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { IconButton } from "../../../components/icon-button";
import { useMainRouterClient } from "../../../lib/trpc";
import { useWindowInfoContext } from "../../window-info/hooks";
import { useWorkspaceStore } from "../stores";

const WindowControls = () => {
	const mainRouter = useMainRouterClient();

	return (
		<div className="window-controls">
			<IconButton action="minimize" onClick={() => mainRouter.window.minimize.mutate()}>
				<MinimizeIcon />
			</IconButton>
			<IconButton action="maximize" onClick={() => mainRouter.window.maximize.mutate()}>
				<MaximizeIcon />
			</IconButton>
			<IconButton action="close" onClick={() => mainRouter.window.close.mutate()}>
				<XIcon />
			</IconButton>
		</div>
	);
};

export const Titlebar = () => {
	const windowInfo = useWindowInfoContext();
	const shouldRenderControls = windowInfo.platform !== "macos";

	const workspaceStore = useWorkspaceStore(
		useShallow((state) => ({
			isPrimarySidebarOpen: state.layout!.primarySidebar.isOpen,
			isSecondarySidebarOpen: state.layout!.secondarySidebar.isOpen,
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

	return (
		<div className="titlebar">
			<div className="titlebar-section" data-section="start">
				<div className="titlebar-action-section">
					<IconButton
						action="toggle-primary-sidebar"
						onClick={togglePrimarySidebarIsOpen}
					>
						{workspaceStore.isPrimarySidebarOpen ? (
							<PanelLeftCloseIcon />
						) : (
							<PanelLeftIcon />
						)}
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
							<PanelRightCloseIcon />
						) : (
							<PanelRightIcon />
						)}
					</IconButton>
				</div>
				{shouldRenderControls && <WindowControls />}
			</div>
		</div>
	);
};
