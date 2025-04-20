import { createFileRoute } from "@tanstack/react-router";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useChatStore } from "../../../features/chat/stores";
import { useMainRouter } from "../../../lib/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { useShallow } from "zustand/shallow";

export const Route = createFileRoute("/chat/$id/")({
	component: ChatPage,
});

const ChatPageContent = () => {
	const params = Route.useParams();
	const mainRouter = useMainRouter();

	const chatStore = useChatStore(
		useShallow((state) => ({
			messages: state.messages,
			addMessage: state.addMessage,
			reset: state.reset,
		}))
	);

	const listChatMessagesQuery = useSuspenseQuery(
		mainRouter.chats.messages.list.queryOptions({
			chat_id: params.id,
		})
	);

	useEffect(() => {
		return () => {
			chatStore.reset();
		};
	}, [params.id]);

	useEffect(() => {
		for (const message of listChatMessagesQuery.data) {
			chatStore.addMessage({
				id: message.id,
				content: message.content,
				role: message.role,
				status: "complete",
				createdAt: message.created_at,
			});
		}
	}, [listChatMessagesQuery.data]);

	return <ChatLog messages={chatStore.messages} />;
};

function ChatPage() {
	return (
		<Suspense fallback={<div>Loading chat...</div>}>
			<ChatPageContent />
		</Suspense>
	);
}
