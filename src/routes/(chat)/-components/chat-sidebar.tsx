import { Link } from "@tanstack/react-router";
import { MessageCirclePlusIcon, SearchIcon } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "../../../components/sidebar";
import { Button, buttonVariants } from "../../../components/button";
import "./chat-sidebar.scss";

interface ChatLinkProps {
	id: string;
	title: string;
}

export const ChatSidebar = () => {
	return (
		<Sidebar className="chat-sidebar">
			<div className="chat-sidebar-actions">
				<Button size="icon" variant="ghost" color="secondary">
					<SearchIcon />
				</Button>
				<Link
					to="/"
					className={buttonVariants({
						size: "icon",
						color: "secondary",
						variant: "ghost",
					})}
				>
					<MessageCirclePlusIcon />
				</Link>
			</div>
			<div className="chat-sidebar-main">
				<SidebarGroup title="Today">
					<Link to="/$id" params={{ id: "1" }}>
						{({ isActive }) => <SidebarItem isActive={isActive}>Chat 1</SidebarItem>}
					</Link>
					<Link to="/$id" params={{ id: "2" }}>
						{({ isActive }) => <SidebarItem isActive={isActive}>Chat 2</SidebarItem>}
					</Link>
				</SidebarGroup>
				<SidebarGroup title="Last 7 days">
					<Link to="/$id" params={{ id: "3" }}>
						{({ isActive }) => <SidebarItem isActive={isActive}>Chat 3</SidebarItem>}
					</Link>
					<Link to="/$id" params={{ id: "4" }}>
						{({ isActive }) => <SidebarItem isActive={isActive}>Chat 4</SidebarItem>}
					</Link>
				</SidebarGroup>
			</div>
		</Sidebar>
	);
};
