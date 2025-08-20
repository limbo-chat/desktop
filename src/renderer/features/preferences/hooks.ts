import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "es-toolkit";
import type { Preference } from "../../../main/db/types";
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

export const useSyncedPreference = (key: string) => {
	const preferences = usePreferences();
	const preferenceValue = preferences[key];
	const setPreferenceMutation = useSetPreferenceMutation();
	const [localValue, setLocalValue] = useState<string | undefined>();

	const debouncedSetPreference = useCallback(
		debounce((preference: Preference) => {
			console.log("syncing preference:", preference);

			setPreferenceMutation.mutate(preference);
		}, 500),
		[]
	);

	const update = useCallback(
		(newValue: string) => {
			setLocalValue(newValue);

			debouncedSetPreference({
				key,
				value: newValue,
			});
		},
		[key]
	);

	useEffect(() => {
		setLocalValue(preferenceValue);
	}, [preferenceValue]);

	return [localValue, update] as const;
};
