import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/button";
import { useDeleteAllChatsMutation } from "../../features/chat/hooks/queries";

export const Route = createFileRoute("/settings/chats")({
	component: ChatSettingsPage,
});

function ChatSettingsPage() {
	const deleteAllChatsMutation = useDeleteAllChatsMutation();

	const handleDeleteAllChats = () => {
		deleteAllChatsMutation.mutate();
	};

	return (
		<div className="chat-settings-page">
			<Button onClick={handleDeleteAllChats}>Delete all chats</Button>
		</div>
	);
}
