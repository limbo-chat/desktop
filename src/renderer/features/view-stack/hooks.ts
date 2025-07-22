import { useState, useCallback, useContext } from "react";
import { viewStackContext } from "./contexts";
import type { View, ViewStackState } from "./types";

export const useViewStackState = (): ViewStackState => {
	const [views, setViews] = useState<View[]>([]);

	const push = useCallback((view: View) => {
		setViews((prevViews) => [...prevViews, view]);
	}, []);

	const pop = useCallback(() => {
		setViews((prevViews) => prevViews.slice(0, -1));
	}, []);

	const replace = useCallback((view: View) => {
		setViews((prevViews) => {
			if (prevViews.length === 0) {
				return [view];
			}

			return [...prevViews.slice(0, -1), view];
		});
	}, []);

	return {
		top: views[views.length - 1] ?? null,
		views,
		push,
		pop,
		replace,
	};
};

export const useViewStackContext = () => {
	const ctx = useContext(viewStackContext);

	if (!ctx) {
		throw new Error("useViewStackContext must be used within a ViewStack");
	}

	return ctx;
};
