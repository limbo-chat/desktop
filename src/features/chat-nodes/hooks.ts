import { useChatNodeStore } from "./stores";

export const useChatNodes = () => {
	return useChatNodeStore((state) => state.chatNodes);
};

export const useChatNode = (chatNodeId: string) => {
	const tools = useChatNodes();

	return tools.get(chatNodeId);
};
