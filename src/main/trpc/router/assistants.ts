import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { assistantSchema } from "../../assistants/schemas";
import { getDb } from "../../db/utils";
import { publicProcedure, router } from "../trpc";

const getAssistantInputSchema = z.object({
	id: z.string(),
});

const createAssistantInputSchema = z.object({
	assistant: assistantSchema,
});

const deleteAssistantInputSchema = z.object({
	id: z.string(),
});

export const assistantsRouter = router({
	getAll: publicProcedure.query(async () => {
		const db = await getDb();

		return await db.selectFrom("assistant").selectAll().execute();
	}),
	get: publicProcedure.input(getAssistantInputSchema).query(async ({ input }) => {
		const db = await getDb();

		const assistant = await db.selectFrom("assistant").selectAll().execute();

		if (!assistant) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Assistant not found",
			});
		}

		return assistant;
	}),
	create: publicProcedure.input(createAssistantInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		const assistant = await db
			.insertInto("assistant")
			.values({
				...input.assistant,
				recommendedPlugins: JSON.stringify(input.assistant.recommendedPlugins),
				recommendedTools: JSON.stringify(input.assistant.recommendedTools),
			})
			.execute();

		return assistant;
	}),
	delete: publicProcedure.input(deleteAssistantInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		await db.deleteFrom("assistant").where("id", "=", input.id).execute();
	}),
});
