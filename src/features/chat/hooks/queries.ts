import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import { removeChatFromQueryCache, updateChatInQueryCache } from "../utils";

export const useCreateChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.chats.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());
			},
			onError: () => {
				// TODO, show error toast
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
			onError: () => {
				// TODO, show error toast
			},
		})
	);
};

export const useDeleteChatMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.chats.delete.mutationOptions({
			onSuccess: (_, variables) => {
				removeChatFromQueryCache(queryClient, mainRouter, variables.id);
			},
			onError: () => {
				// TODO, show error toast
			},
		})
	);
};
