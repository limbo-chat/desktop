import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../../db/db";
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

const getManyChatMessagesInputSchema = z.object({
	chatId: z.string(),
	role: z.enum(["user", "assistant"]).optional(),
	sort: z.enum(["newest", "oldest"]).optional(),
	limit: z.number().optional(),
});

export const chatMessagesRouter = router({
	list: publicProcedure.input(listChatMessagesInputSchema).query(async ({ input }) => {
		const chatMessages = await db
			.selectFrom("chatMessage")
			.selectAll()
			.where("chatId", "=", input.chatId)
			.execute();

		const chatMessagesWithParsedContent = chatMessages.map((chatMessage) => {
			const parsedContent = JSON.parse(chatMessage.content);

			return {
				...chatMessage,
				content: parsedContent,
			};
		});

		return chatMessagesWithParsedContent;
	}),
	getMany: publicProcedure.input(getManyChatMessagesInputSchema).query(async ({ input }) => {
		const chatMessagesQuery = db
			.selectFrom("chatMessage")
			.selectAll()
			.where("chatId", "=", input.chatId);

		if (input.role) {
			chatMessagesQuery.where("role", "=", input.role);
		}

		if (input.sort === "newest") {
			chatMessagesQuery.orderBy("createdAt", "desc");
		} else {
			chatMessagesQuery.orderBy("createdAt", "asc");
		}

		if (input.limit) {
			chatMessagesQuery.limit(input.limit);
		}

		const chatMessages = await chatMessagesQuery.execute();

		const chatMessagesWithParsedContent = chatMessages.map((chatMessage) => {
			const parsedContent = JSON.parse(chatMessage.content);

			return {
				...chatMessage,
				content: parsedContent,
			};
		});

		return chatMessagesWithParsedContent;
	}),
	create: publicProcedure.input(createChatMessageInputSchema).mutation(async ({ input }) => {
		const chatMessage = await db
			.insertInto("chatMessage")
			.values({
				...input,
				content: JSON.stringify(input.content),
			})
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
