import { useQueryClient } from "@tanstack/react-query";
import {
	MaximizeIcon,
	MinimizeIcon,
	PanelLeftCloseIcon,
	PanelLeftIcon,
	PanelRightCloseIcon,
	PanelRightIcon,
	SquarePenIcon,
	XIcon,
} from "lucide-react";
import { useShallow } from "zustand/shallow";
import { IconButton } from "../../../components/icon-button";
import { useMainRouter, useMainRouterClient } from "../../../lib/trpc";
import { useChatStore } from "../../chat/stores";
import { usePluginManager } from "../../plugins/hooks/core";
import { useWindowInfoContext } from "../../window-info/hooks";
import { useWorkspaceStore } from "../stores";
import { setActiveChatId } from "../utils";

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
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const queryClient = useQueryClient();
	const pluginManager = usePluginManager();
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

	const createNewChat = async () => {
		const chatStore = useChatStore.getState();

		// create a new chat
		const newChat = await mainRouterClient.chats.create.mutate({
			name: "New chat",
		});

		// add the new chat to the store
		chatStore.addChat(newChat.id);

		// set the new chat as the active chat
		setActiveChatId(newChat.id);

		queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());

		await pluginManager.executeOnChatCreatedHooks({
			chatId: newChat.id,
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
							<PanelLeftCloseIcon />
						) : (
							<PanelLeftIcon />
						)}
					</IconButton>
					<IconButton action="create-new-chat" onClick={createNewChat}>
						<SquarePenIcon />
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
