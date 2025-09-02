import { useEffect } from "react";
import type * as limbo from "@limbo-chat/api";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { RenameChatDialog } from "../../chat/components/rename-chat-dialog";
import { useDeleteChatMutation } from "../../chat/hooks/queries";
import { addCommand, removeCommand } from "../../commands/utils";
import { showDesignPlaygroundModal } from "../../design-playground/utils";
import { showModal } from "../../modals/utils";
import { useWorkspaceStore } from "../../workspace/stores";

export const useRegisterCoreCommands = () => {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();

	useEffect(() => {
		const openDesignPlaygroundCommand: limbo.Command = {
			id: buildNamespacedResourceId("core", "open-design-playground"),
			name: "Open design playground",
			execute: () => {
				showDesignPlaygroundModal();
			},
		};

		const reloadCustomStylesCommand: limbo.Command = {
			id: buildNamespacedResourceId("core", "custom-styles:reload"),
			name: "Reload custom styles",
			execute: () => {
				queryClient.resetQueries(mainRouter.customStyles.getPaths.queryFilter());
			},
		};

		addCommand(openDesignPlaygroundCommand);
		addCommand(reloadCustomStylesCommand);

		return () => {
			removeCommand(openDesignPlaygroundCommand.id);
			removeCommand(reloadCustomStylesCommand.id);
		};
	}, []);
};

export const useRegisterActiveChatCommands = () => {
	const mainRouter = useMainRouter();
	const activeChatId = useWorkspaceStore((state) => state.workspace?.activeChatId ?? null);
	const deleteChatMutation = useDeleteChatMutation();

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

		const renameCurrentChatCommand: limbo.Command = {
			id: buildNamespacedResourceId("core", "current-chat:rename"),
			name: "Rename current chat",
			execute: () => {
				showModal({
					id: "rename-chat",
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
		};

		const deleteCurrentChatCommand: limbo.Command = {
			id: buildNamespacedResourceId("core", "current-chat:delete"),
			name: "Delete current chat",
			execute: async () => {
				await deleteChatMutation.mutateAsync({ id: activeChat.id });
			},
		};

		addCommand(renameCurrentChatCommand);
		addCommand(deleteCurrentChatCommand);

		return () => {
			removeCommand(renameCurrentChatCommand.id);
			removeCommand(deleteCurrentChatCommand.id);
		};
	}, [activeChat]);
};
