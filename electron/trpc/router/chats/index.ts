import { publicProcedure, router } from "../../trpc";
import { chatMessagesRouter } from "./messages";
import { db } from "../../../db/db";
import { z } from "zod";
import { ulid } from "ulid";

const createChatInputSchema = z.object({
	title: z.string(),
});

export const chatsRouter = router({
	messages: chatMessagesRouter,
	list: publicProcedure.query(async () => {
		const chats = await db.selectFrom("chat").selectAll().execute();

		return chats;
	}),
	create: publicProcedure.input(createChatInputSchema).mutation(async ({ input, ctx }) => {
		const chat = await db
			.insertInto("chat")
			.values({
				id: ulid(),
				title: input.title,
				created_at: new Date().toISOString(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return chat;
	}),
	delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		await db.deleteFrom("chat").where("id", "=", input.id).execute();
	}),
});
