import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainRouter } from "../../lib/trpc";
import { preferencesContext } from "./context";

export const usePreferences = () => {
	const ctx = useContext(preferencesContext);

	if (!ctx) {
		throw new Error("usePreferences must be used within a PreferencesProvider");
	}

	return ctx;
};

export const useSetPreferenceMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.preferences.set.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(mainRouter.preferences.getAll.queryOptions());
			},
		})
	);
};
