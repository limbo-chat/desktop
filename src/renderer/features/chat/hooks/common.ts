import { useChatStore } from "../stores";

export const useChatState = (chatId: string) => {
	return useChatStore((state) => state.chats[chatId]);
};
