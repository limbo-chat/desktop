import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { db } from "../../../db/db";
import { TRPCError } from "@trpc/server";

const listChatMessagesInputSchema = z.object({
	chat_id: z.number(),
});

const createChatMessageInputSchema = z.object({
	chat_id: z.number(),
	content: z.string(),
	role: z.enum(["user", "assistant"]),
	created_at: z.string().datetime(),
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
	create: publicProcedure.input(createChatMessageInputSchema).mutation(async ({ input }) => {
		const chatMessage = await db
			.insertInto("chat_message")
			.values(input)
			.returningAll()
			.executeTakeFirst();

		if (!chatMessage) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create chat message",
			});
		}

		return chatMessage;
	}),
});
