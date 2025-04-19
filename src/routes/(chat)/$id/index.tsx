import { createFileRoute } from "@tanstack/react-router";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useChatStore } from "../../../features/chat/stores";

export const Route = createFileRoute("/(chat)/$id/")({
	component: ChatPage,
});

function ChatPage() {
	const messages = useChatStore((state) => state.messages);

	return <ChatLog messages={messages} />;
}
