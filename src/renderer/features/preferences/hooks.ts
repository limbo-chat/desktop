import { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "es-toolkit";
import type { Preference } from "../../../main/db/types";
import { useMainRouter } from "../../lib/trpc";

export const usePreference = <T = unknown>(key: string): T | undefined => {
	const mainRouter = useMainRouter();

	const getPreferenceQuery = useQuery(
		mainRouter.preferences.get.queryOptions({
			key,
		})
	);

	return getPreferenceQuery.data as T | undefined;
};

export const useSetPreferenceMutation = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	return useMutation(
		mainRouter.preferences.set.mutationOptions({
			onSuccess: (_, input) => {
				queryClient.invalidateQueries(
					mainRouter.preferences.get.queryFilter({
						key: input.key,
					})
				);
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
