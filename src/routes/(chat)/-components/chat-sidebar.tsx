import { Link } from "@tanstack/react-router";
import { MessageCirclePlusIcon, SearchIcon } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "../../../components/sidebar";
import { IconButton, iconButtonVariants } from "../../../components/icon-button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import "./chat-sidebar.scss";

export const ChatSidebar = () => {
	const mainRouter = useMainRouter();
	const listChatsQuery = useSuspenseQuery(mainRouter.chats.list.queryOptions());

	return (
		<Sidebar className="chat-sidebar">
			<div className="chat-sidebar-actions">
				<IconButton variant="ghost" color="secondary">
					<SearchIcon />
				</IconButton>
				<Link
					to="/"
					className={iconButtonVariants({
						color: "secondary",
						variant: "ghost",
					})}
				>
					<MessageCirclePlusIcon />
				</Link>
			</div>
			<div className="chat-sidebar-main">
				<SidebarGroup title="All time">
					{listChatsQuery.data.map((chat) => (
						<Link to="/$id" params={{ id: chat.id.toString() }}>
							{({ isActive }) => (
								<SidebarItem isActive={isActive}>{chat.title}</SidebarItem>
							)}
						</Link>
					))}
				</SidebarGroup>
			</div>
		</Sidebar>
	);
};
