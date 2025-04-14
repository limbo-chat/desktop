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
					role: "assistant",
					content: `Hello brother!\n# Heading 1\n## heading 2\n## heading 3 \n text 1 \n\n *text 2* [google](https://google.com) \n \`\`\`typescript\nconsole.log("test")\n\`\`\``,
				},
			]}
		/>
	);
}
