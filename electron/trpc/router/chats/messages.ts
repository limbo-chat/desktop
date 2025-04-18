import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { db } from "../../../db/db";

const listChatMessagesInputSchema = z.object({
	chat_id: z.number(),
});

export const chatMessagesRouter = router({
	list: publicProcedure.input(listChatMessagesInputSchema).query(async ({ input }) => {
		const chatMessages = await db
			.selectFrom("chat_message")
			.selectAll()
			.where("chat_id", "=", input.chat_id)
			.execute();

		return chatMessages;
	}),
});
