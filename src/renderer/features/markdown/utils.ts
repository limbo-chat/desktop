import type * as limbo from "@limbo-chat/api";
import { useMarkdownElementStore } from "./stores";

export function addMarkdownElement(elementId: string, element: limbo.ui.MarkdownElement) {
	const markdownElementStore = useMarkdownElementStore.getState();

	markdownElementStore.addElement(elementId, element);
}

export function removeMarkdownElement(elementId: string) {
	const markdownElementStore = useMarkdownElementStore.getState();

	markdownElementStore.removeElement(elementId);
}
