import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "../../db/db";
import { publicProcedure, router } from "../trpc";

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
});
