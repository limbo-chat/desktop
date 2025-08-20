import { useCallback, useContext, useEffect, useState } from "react";
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

export const usePreference = <T = unknown>(key: string): T | undefined => {
	return usePreferences()[key] as T | undefined;
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

export const useSyncedPreference = <T = unknown>(key: string) => {
	const preferenceValue = usePreference<T>(key);
	const setPreferenceMutation = useSetPreferenceMutation();
	const [localValue, setLocalValue] = useState<T | undefined>();

	const debouncedSetPreference = useCallback(
		debounce((preference: Preference) => {
			setPreferenceMutation.mutate(preference);
		}, 500),
		[]
	);

	const update = useCallback(
		(newValue: T) => {
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
