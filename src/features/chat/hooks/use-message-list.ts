import { useChatStore } from "../stores";

export const useMessageList = () => {
	return useChatStore((state) => state.messages);
};
