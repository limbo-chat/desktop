import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMainRouter } from "../../lib/trpc";

export const useGetSettingsSuspenseQuery = () => {
	const mainRouter = useMainRouter();

	return useSuspenseQuery(mainRouter.settings.get.queryOptions());
};

export const useUpdateSettingsMutation = () => {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();

	return useMutation(
		mainRouter.settings.update.mutationOptions({
			onSuccess: (newSettings) => {
				queryClient.setQueryData(mainRouter.settings.get.queryKey(), newSettings);
			},
		})
	);
};
