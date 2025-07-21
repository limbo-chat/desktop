import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";
import { getDb } from "../../../db/utils";
import { publicProcedure, router } from "../../trpc";
import { chatMessagesRouter } from "./messages";

const createChatInputSchema = z.object({
	name: z.string(),
});

const updateChatInputSchema = z.object({
	id: z.string(),
	data: z
		.object({
			name: z.string(),
			userMessageDraft: z.string().nullable(),
			llmId: z.string().nullable(),
			enabledToolIds: z.string().array(),
			lastActivityAt: z.string().nullable(),
		})
		.partial(),
});

export type UpdateChatInput = z.infer<typeof updateChatInputSchema>;

export const chatsRouter = router({
	messages: chatMessagesRouter,
	list: publicProcedure.query(async () => {
		const db = await getDb();

		const chats = await db
			.selectFrom("chat")
			.select(["id", "name", "createdAt"])
			.orderBy("lastActivityAt", "desc")
			.orderBy("createdAt", "desc")
			.execute();

		return chats;
	}),
	get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		const db = await getDb();

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
		const db = await getDb();

		const chat = await db
			.insertInto("chat")
			.values({
				id: ulid(),
				name: input.name,
				enabledToolIds: JSON.stringify([]),
				createdAt: new Date().toISOString(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return chat;
	}),
	update: publicProcedure.input(updateChatInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		let newEnabledToolIds = undefined;

		if (input.data.enabledToolIds) {
			newEnabledToolIds = JSON.stringify(input.data.enabledToolIds);
		}

		const updatedChat = await db
			.updateTable("chat")
			.where("id", "=", input.id)
			.set({
				...input.data,
				enabledToolIds: newEnabledToolIds,
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
		const db = await getDb();

		await db.deleteFrom("chat").where("id", "=", input.id).execute();
	}),
	deleteAll: publicProcedure.mutation(async () => {
		const db = await getDb();

		const deletedChatResults = await db.deleteFrom("chat").returning("id").execute();

		return deletedChatResults.map((result) => result.id);
	}),
});
