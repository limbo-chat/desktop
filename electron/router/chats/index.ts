import { publicProcedure, router } from "../../trpc";
import { z } from "zod";
import { chatMessagesRouter } from "./messages";

const sendMessageInputSchema = z.object({
	message: z.string().min(1),
});

export const chatsRouter = router({
	messages: chatMessagesRouter,
	list: publicProcedure.query(() => {
		return [
			{
				id: 1,
				title: "First chat",
			},
			{
				id: 2,
				title: "Second chat",
			},
			{
				id: 3,
				title: "Third chat",
			},
		];
	}),
	sendMessage: publicProcedure.input(sendMessageInputSchema).mutation(async ({ input, ctx }) => {
		return {
			success: true,
		};
	}),
});
