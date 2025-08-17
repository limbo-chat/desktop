import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import { usePluginManager } from "../../plugins/hooks/core";
import { useWorkspaceStore } from "../../workspace/stores";
import { setActiveChatId } from "../../workspace/utils";
import { useChatStore } from "../stores";
import { removeChatFromQueryCache, updateChatInQueryCache } from "../utils";

export const useCreateChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();
	const pluginManager = usePluginManager();

	return useMutation(
		mainRouter.chats.create.mutationOptions({
			onSuccess: async (newChat) => {
				const chatStore = useChatStore.getState();

				chatStore.addChat(newChat.id);

				setActiveChatId(newChat.id);

				queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());

				await pluginManager.executeOnChatCreatedHooks({
					chatId: newChat.id,
				});
			},
		})
	);
};

export const useRenameChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.chats.update.mutationOptions({
			onSuccess: (updatedChat) => {
				updateChatInQueryCache(queryClient, mainRouter, updatedChat);
			},
		})
	);
};

export const useDeleteChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();
	const pluginManager = usePluginManager();

	return useMutation(
		mainRouter.chats.delete.mutationOptions({
			onSuccess: async (_, variables) => {
				const workspaceStore = useWorkspaceStore.getState();
				const workspaceState = workspaceStore.workspace!;

				if (workspaceState.activeChatId === variables.id) {
					workspaceStore.setActiveChatId(null);
				}

				removeChatFromQueryCache(queryClient, mainRouter, variables.id);

				await pluginManager.executeOnChatDeletedHooks(variables.id);
			},
		})
	);
};

export const useDeleteAllChatsMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();
	const pluginManager = usePluginManager();

	return useMutation(
		mainRouter.chats.deleteAll.mutationOptions({
			onSuccess: async (deletedChatIds) => {
				setActiveChatId(null);

				queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());

				await pluginManager.executeOnChatsDeletedHooks(deletedChatIds);
			},
		})
	);
};
