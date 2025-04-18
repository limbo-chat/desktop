import { createFileRoute } from "@tanstack/react-router";
import { ChatLog } from "../../../features/chat/components/chat-log";

export const Route = createFileRoute("/(chat)/$id/")({
	component: ChatPage,
});

function ChatPage() {
	// const messages = useChatMessages();

	return (
		<ChatLog
			messages={[
				{
					id: 1,
					role: "user",
					content: "Hello!",
				},
				{
					id: 2,
					role: "user",
					content: "Hello!",
				},
				{
					id: 3,
					role: "user",
					content: "Hello!",
				},
				{
					id: 4,
					role: "user",
					content: "Hello!",
				},
				{
					id: 5,
					role: "user",
					content: "Hello!",
				},
				{
					id: 6,
					role: "user",
					content: "Hello!",
				},
				{
					id: 7,
					role: "user",
					content: "Hello!",
				},
			]}
		/>
	);
}
