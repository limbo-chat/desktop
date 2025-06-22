import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import { usePluginManager } from "../../plugins/hooks/core";
import { removeChatFromQueryCache, updateChatInQueryCache } from "../utils";

export const useCreateChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.chats.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());
			},
		})
	);
};

export const useRenameChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.chats.rename.mutationOptions({
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
				queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());

				await pluginManager.executeOnChatsDeletedHooks(deletedChatIds);
			},
		})
	);
};
