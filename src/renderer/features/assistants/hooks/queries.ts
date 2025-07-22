import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";

export const useCreateAssistantMutation = () => {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();

	return useMutation(
		mainRouter.assistants.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(mainRouter.assistants.getAll.queryFilter());
			},
		})
	);
};

export const useDeleteAssistantMutation = () => {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();

	return useMutation(
		mainRouter.assistants.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(mainRouter.assistants.getAll.queryFilter());
			},
		})
	);
};
