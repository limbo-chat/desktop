import { useMemo } from "react";
import type * as limbo from "@limbo/api";
import { useChatNodeStore } from "./stores";

export const useChatNodes = () => {
	return useChatNodeStore((state) => state.chatNodes);
};

export const useChatNode = (chatNodeId: string) => {
	const chatNodes = useChatNodes();

	return chatNodes.get(chatNodeId);
};

export const useCollatedChatNodeComponents = () => {
	const chatNodes = useChatNodes();

	return useMemo(() => {
		const collatedComponents = new Map<string, limbo.ui.ChatNodeComponent>();

		for (const chatNode of chatNodes.values()) {
			collatedComponents.set(chatNode.id, chatNode.component);
		}

		return collatedComponents;
	}, [chatNodes]);
};
