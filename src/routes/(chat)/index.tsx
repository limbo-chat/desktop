import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(chat)/")({
	component: NewChatPage,
});

function NewChatPage() {
	return <div className="h-full flex items-center justify-center">new chat</div>;
}
