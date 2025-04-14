import { Link } from "@tanstack/react-router";
import "./chat-sidebar.scss";
import { PlusIcon } from "lucide-react";
import { Button, buttonVariants } from "../../../components/button";

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
			<Link
				to="/"
				className={buttonVariants({ className: "new-chat-button", color: "secondary" })}
			>
				New chat
			</Link>
			<div className="chat-links">
				<ChatLink id="1" title="Chat 1" />
				<ChatLink id="2" title="Chat 2" />
			</div>
		</div>
	);
};
