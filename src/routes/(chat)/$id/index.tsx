import { createFileRoute } from "@tanstack/react-router";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useChatMessages } from "../../../features/chat/hooks";

export const Route = createFileRoute("/(chat)/$id/")({
	component: ChatPage,
});

function ChatPage() {
	const messages = useChatMessages();

	return <ChatLog messages={messages} />;
}
