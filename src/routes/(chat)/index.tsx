import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(chat)/")({
	component: NewChatPage,
});

function NewChatPage() {
	return <div className="chat-launcher">new chat</div>;
}
