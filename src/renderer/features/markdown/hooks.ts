import { useMemo } from "react";
import type * as limbo from "@limbo-chat/api";
import { useMarkdownElementStore } from "./stores";

export const useMarkdownElements = () => {
	return useMarkdownElementStore((state) => state.elements);
};

export const useCollatedMarkdownComponents = () => {
	const markdownElements = useMarkdownElements();

	return useMemo(() => {
		const collatedComponents = new Map<string, limbo.ui.MarkdownComponent>();

		for (const markdownElement of markdownElements.values()) {
			collatedComponents.set(markdownElement.element, markdownElement.component);
		}

		return collatedComponents;
	}, [markdownElements]);
};
