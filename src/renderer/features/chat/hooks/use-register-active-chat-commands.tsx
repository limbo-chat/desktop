import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMainRouter, useMainRouterClient } from "../../../lib/trpc";
import { addCommand, removeCommand } from "../../commands/utils";
import { showDialog } from "../../modals/utils";
import { useWorkspaceStore } from "../../workspace/stores";
import { RenameChatDialog } from "../components/rename-chat-dialog";

export const useRegisterActiveChatCommands = () => {
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const activeChatId = useWorkspaceStore((state) => state.workspace?.activeChatId ?? null);

	const getActiveChatQuery = useQuery(
		mainRouter.chats.get.queryOptions(
			{
				id: activeChatId as string,
			},
			{
				enabled: !!activeChatId,
			}
		)
	);

	const activeChat = getActiveChatQuery.data;

	useEffect(() => {
		if (!activeChat) {
			return;
		}

		addCommand({
			id: "rename-current-chat",
			name: "Rename current chat",
			execute: () => {
				showDialog({
					component: () => (
						<RenameChatDialog
							chat={{
								id: activeChat.id,
								name: activeChat.name,
							}}
						/>
					),
				});
			},
		});

		addCommand({
			id: "delete-current-chat",
			name: "Delete current chat",
			execute: async () => {
				try {
					await mainRouterClient.chats.delete.mutate({ id: activeChat.id });
				} catch (error) {
					console.error("Failed to delete chat:", error);
				}
			},
		});

		return () => {
			removeCommand("rename-current-chat");
			removeCommand("delete-current-chat");
		};
	}, [activeChat]);
};
