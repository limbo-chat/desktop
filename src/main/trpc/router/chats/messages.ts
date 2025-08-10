import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../../../db/utils";
import { publicProcedure, router } from "../../trpc";

const listChatMessagesInputSchema = z.object({
	chatId: z.string(),
});

const chatNodeSchema = z.object({
	type: z.string(),
	data: z.record(z.any()),
});

const createChatMessageInputSchema = z.object({
	id: z.string(),
	chatId: z.string(),
	role: z.enum(["user", "assistant"]),
	content: z.array(chatNodeSchema),
	createdAt: z.string().datetime(),
});

const updateChatMessageInputSchema = z.object({
	id: z.string(),
	data: z
		.object({
			content: z.array(chatNodeSchema),
		})
		.partial(),
});

const getManyChatMessagesInputSchema = z.object({
	chatId: z.string(),
	role: z.enum(["user", "assistant"]).optional(),
	sort: z.enum(["newest", "oldest"]).optional(),
	limit: z.number().optional(),
});

export const chatMessagesRouter = router({
	list: publicProcedure.input(listChatMessagesInputSchema).query(async ({ input }) => {
		const db = await getDb();

		const chatMessages = await db
			.selectFrom("chat_message")
			.selectAll()
			.where("chat_id", "=", input.chatId)
			.execute();

		return chatMessages;
	}),
	getMany: publicProcedure.input(getManyChatMessagesInputSchema).query(async ({ input }) => {
		const db = await getDb();

		const chatMessagesQuery = db
			.selectFrom("chat_message")
			.selectAll()
			.where("chat_id", "=", input.chatId);

		if (input.role) {
			chatMessagesQuery.where("role", "=", input.role);
		}

		if (input.sort === "newest") {
			chatMessagesQuery.orderBy("created_at", "desc");
		} else {
			chatMessagesQuery.orderBy("created_at", "asc");
		}

		if (input.limit) {
			chatMessagesQuery.limit(input.limit);
		}

		return await chatMessagesQuery.execute();
	}),
	create: publicProcedure.input(createChatMessageInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		const chatMessage = await db
			.insertInto("chat_message")
			.values({
				id: input.id,
				chat_id: input.chatId,
				created_at: input.createdAt,
				role: input.role,
				content: JSON.stringify(input.content),
			})
			.returningAll()
			.executeTakeFirst();

		// this should never happen, but just in case
		if (!chatMessage) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create chat message",
			});
		}

		return chatMessage;
	}),
	update: publicProcedure.input(updateChatMessageInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		await db
			.updateTable("chat_message")
			.set({
				...input.data,
				content: input.data.content ? JSON.stringify(input.data.content) : undefined,
			})
			.where("id", "=", input.id)
			.execute();
	}),
});
