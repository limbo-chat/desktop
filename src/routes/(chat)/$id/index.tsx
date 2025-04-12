import { createFileRoute } from "@tanstack/react-router";
import { useChatMessages } from "../../../features/chat/hooks";
import { ChatLog } from "../../../features/chat/components/chat-log";

export const Route = createFileRoute("/(chat)/$id/")({
	component: ChatPage,
});

const MainChatLog = () => {
	const messages = useChatMessages();

	return <ChatLog className="mx-auto px-xl w-full max-w-[75ch]" messages={messages} />;
};

function ChatPage() {
	return (
		<div className="pt-xl">
			<MainChatLog />
		</div>
	);
}
