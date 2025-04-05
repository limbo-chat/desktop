import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

const listChatMessagesInputSchema = z.object({
	chatId: z.number(),
});

export const chatMessagesRouter = router({
	list: publicProcedure.input(listChatMessagesInputSchema).query(() => {
		return [
			{
				id: 1,
				role: "assistant",
				content: "This is the first message from the assistant.",
			},
			{
				id: 2,
				role: "user",
				content: "This is the first message from the user.",
			},
		];
	}),
});
