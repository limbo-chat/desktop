import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/chat/")({
	component: NewChatPage,
});

function NewChatPage() {
	return <div className="new-chat-page">new chat</div>;
}
