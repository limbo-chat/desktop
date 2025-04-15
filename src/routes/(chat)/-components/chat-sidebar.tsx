import { Link } from "@tanstack/react-router";
import { MessageCirclePlusIcon, SearchIcon } from "lucide-react";
import { Button, buttonVariants } from "../../../components/button";
import "./chat-sidebar.scss";

interface ChatLinkProps {
	id: string;
	title: string;
}

const ChatLink = ({ id, title }: ChatLinkProps) => {
	return (
		<Link to="/$id" params={{ id }} className="chat-link">
			{title}
		</Link>
	);
};

export const ChatSidebar = () => {
	return (
		<div className="chat-sidebar">
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
				<div className="chat-links">
					<ChatLink id="1" title="Chat 1" />
					<ChatLink id="2" title="Chat 2" />
					<ChatLink id="3" title="Chat 3" />
					<ChatLink id="4" title="Chat 4" />
				</div>
			</div>
		</div>
	);
};
