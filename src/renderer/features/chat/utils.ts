import type { QueryClient } from "@tanstack/react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import handlebars from "handlebars";
import type { MainRouter, MainRouterOutputs } from "../../../main/trpc/router";

export function removeChatFromQueryCache(
	queryClient: QueryClient,
	mainRouter: TRPCOptionsProxy<MainRouter>,
	chatId: string
) {
	queryClient.removeQueries(mainRouter.chats.get.queryFilter({ id: chatId }));

	queryClient.setQueryData(mainRouter.chats.list.queryKey(), (oldChats) => {
		if (!oldChats) {
			return;
		}

		return oldChats.filter((chat) => chat.id !== chatId);
	});
}

export function updateChatInQueryCache(
	queryClient: QueryClient,
	mainRouter: TRPCOptionsProxy<MainRouter>,
	updatedChat: MainRouterOutputs["chats"]["get"]
) {
	queryClient.setQueryData(
		mainRouter.chats.get.queryKey({
			id: updatedChat.id,
		}),
		updatedChat
	);

	queryClient.setQueryData(mainRouter.chats.list.queryKey(), (oldChats) => {
		if (!oldChats) {
			return;
		}

		return oldChats.map((chat) => {
			if (chat.id === updatedChat.id) {
				return updatedChat;
			}

			return chat;
		});
	});
}
