import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../db/db";
import { publicProcedure, router } from "../trpc";

const createToolCallSchema = z.object({
	id: z.string(),
	toolId: z.string(),
	status: z.enum(["success", "error"]),
	arguments: z.record(z.any()),
	result: z.string().nullish(),
	error: z.string().nullish(),
});

export const toolCallsRouter = router({
	get: publicProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(async ({ input }) => {
			const [toolCall] = await db
				.selectFrom("toolCall")
				.selectAll()
				.where("id", "=", input.id)
				.execute();

			if (!toolCall) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Tool call of id ${input.id} not found`,
				});
			}

			return toolCall;
		}),
	create: publicProcedure.input(createToolCallSchema).mutation(async ({ input }) => {
		const chatMessage = await db
			.insertInto("toolCall")
			.values({
				...input,
				arguments: JSON.stringify(input.arguments),
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
