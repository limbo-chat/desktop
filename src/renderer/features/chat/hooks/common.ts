import { useChatStore } from "../stores";

export const useChatState = (chatId: string | undefined) => {
	return useChatStore((state) => {
		if (!chatId) {
			return undefined;
		}

		return state.chats[chatId];
	});
};
