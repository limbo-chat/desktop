import { publicProcedure, router } from "../../trpc";
import { chatMessagesRouter } from "./messages";
import { db } from "../../../db/db";
import { z } from "zod";
import { ulid } from "ulid";
import { TRPCError } from "@trpc/server";

const createChatInputSchema = z.object({
	title: z.string(),
});

const renameChatInputSchema = z.object({
	id: z.string(),
	title: z.string(),
});

export const chatsRouter = router({
	messages: chatMessagesRouter,
	list: publicProcedure.query(async () => {
		const chats = await db.selectFrom("chat").selectAll().execute();

		return chats;
	}),
	get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		const chat = await db
			.selectFrom("chat")
			.selectAll()
			.where("id", "=", input.id)
			.executeTakeFirst();

		if (!chat) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Chat with id ${input.id} not found`,
			});
		}

		return chat;
	}),
	create: publicProcedure.input(createChatInputSchema).mutation(async ({ input, ctx }) => {
		const chat = await db
			.insertInto("chat")
			.values({
				id: ulid(),
				name: input.title,
				createdAt: new Date().toISOString(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return chat;
	}),
	rename: publicProcedure.input(renameChatInputSchema).mutation(async ({ input }) => {
		const chat = await db
			.selectFrom("chat")
			.selectAll()
			.where("id", "=", input.id)
			.executeTakeFirst();

		if (!chat) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Chat with id ${input.id} not found`,
			});
		}

		const updatedChat = await db
			.updateTable("chat")
			.where("id", "=", input.id)
			.set({
				name: input.title,
			})
			.returningAll()
			.executeTakeFirst();

		// this will probably never happen, but just in case
		if (!updatedChat) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Failed to update chat`,
			});
		}

		return updatedChat;
	}),
	delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		await db.deleteFrom("chat").where("id", "=", input.id).execute();
	}),
});
