import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ChatSidebar } from "./-components/chat-sidebar";
import { ChatComposer } from "./-components/chat-composer";
import "./styles.scss";

export const Route = createFileRoute("/(chat)")({
	component: ChatLayout,
});

function ChatLayout() {
	return (
		<div className="chat-page">
			<ChatSidebar />
			<div className="chat-content">
				<Outlet />
				<ChatComposer />
			</div>
		</div>
	);
}
