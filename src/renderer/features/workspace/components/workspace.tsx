import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { ChatListView } from "../../chat/components/chat-list-view";
import { useEphemeralWorkspaceStore, useWorkspaceStore } from "../stores";
import { ResizeHandle } from "./resize-handle";
import { SideDock } from "./side-dock";
import { Titlebar } from "./titlebar";

export const Workspace = () => {
	const workspaceStore = useWorkspaceStore(
		useShallow((state) => ({
			activeChatId: state.workspace!.activeChatId,
			primarySidebar: state.workspace!.layout.primarySidebar,
			secondarySidebar: state.workspace!.layout.secondarySidebar,
			setSecondarySidebarWidth: state.setSecondarySidebarWidth,
			setPrimarySidebarWidth: state.setPrimarySidebarWidth,
		}))
	);

	const ephemeralWorkspaceStore = useEphemeralWorkspaceStore(
		useShallow((state) => ({
			isResizing: state.isResizing,
		}))
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const primarySidebarRef = useRef<HTMLDivElement>(null);
	const secondarySidebarRef = useRef<HTMLDivElement>(null);

	const [isResizingPrimarySidebar, setIsResizingPrimarySidebar] = useState(false);
	const [isResizingSecondarySidebar, setIsResizingSecondarySidebar] = useState(false);

	const isPrimarySidebarOpen = workspaceStore.primarySidebar.isOpen;
	const isSecondarySidebarOpen = workspaceStore.secondarySidebar.isOpen;

	const handleMouseDown = useCallback((sidebar: "primary" | "secondary") => {
		if (sidebar === "primary") {
			setIsResizingPrimarySidebar(true);
		} else {
			setIsResizingSecondarySidebar(true);
		}

		const ephemeralWorkspaceStore = useEphemeralWorkspaceStore.getState();

		ephemeralWorkspaceStore.setIsResizing(true);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!containerRef.current) {
				return;
			}

			if (isResizingPrimarySidebar) {
				const sidebarRect = primarySidebarRef.current!.getBoundingClientRect();
				const newWidth = Math.max(175, e.clientX - sidebarRect.left);

				workspaceStore.setPrimarySidebarWidth(newWidth);
			} else if (isResizingSecondarySidebar) {
				const sidebarRect = secondarySidebarRef.current!.getBoundingClientRect();
				const newWidth = Math.max(175, sidebarRect.right - e.clientX);

				workspaceStore.setSecondarySidebarWidth(newWidth);
			}
		},
		[isResizingPrimarySidebar, isResizingSecondarySidebar]
	);

	const handleMouseUp = useCallback(() => {
		setIsResizingPrimarySidebar(false);
		setIsResizingSecondarySidebar(false);

		const ephemeralWorkspaceStore = useEphemeralWorkspaceStore.getState();

		ephemeralWorkspaceStore.setIsResizing(false);
	}, []);

	// Attach global mouse events
	useEffect(() => {
		if (isResizingPrimarySidebar || isResizingSecondarySidebar) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizingPrimarySidebar, isResizingSecondarySidebar, handleMouseMove, handleMouseUp]);

	return (
		<div
			className="workspace"
			data-is-primary-sidebar-open={isPrimarySidebarOpen}
			data-is-secondary-sidebar-open={isSecondarySidebarOpen}
			data-is-resizing={ephemeralWorkspaceStore.isResizing}
			ref={containerRef}
		>
			<Titlebar />
			<div className="workspace-content">
				<SideDock />
				{isPrimarySidebarOpen && (
					<>
						<div
							className="sidebar primary-sidebar"
							data-is-resizing={isResizingPrimarySidebar}
							style={{ width: workspaceStore.primarySidebar.width }}
							ref={primarySidebarRef}
						>
							<ChatListView />
						</div>
						<ResizeHandle onMouseDown={() => handleMouseDown("primary")} />
					</>
				)}
				<div className="main">{/* <ChatView /> */}</div>
				{isSecondarySidebarOpen && (
					<>
						<ResizeHandle onMouseDown={() => handleMouseDown("secondary")} />
						<div
							className="sidebar secondary-sidebar"
							data-is-resizing={isResizingSecondarySidebar}
							style={{ width: workspaceStore.secondarySidebar.width }}
							ref={secondarySidebarRef}
						></div>
					</>
				)}
			</div>
		</div>
	);
};
