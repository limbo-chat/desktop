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

const updateAssistantInputSchema = z.object({
	id: z.string(),
	data: assistantSchema
		.pick({
			name: true,
			description: true,
			system_prompt: true,
			recommended_plugins: true,
			recommended_tools: true,
		})
		.partial(),
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

		const assistant = await db
			.selectFrom("assistant")
			.selectAll()
			.where("id", "=", input.id)
			.executeTakeFirst();

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
				recommended_plugins: JSON.stringify(input.assistant.recommended_plugins),
				recommended_tools: JSON.stringify(input.assistant.recommended_tools),
			})
			.execute();

		return assistant;
	}),
	update: publicProcedure.input(updateAssistantInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		await db
			.updateTable("assistant")
			.set({
				...input.data,
				recommended_plugins: input.data.recommended_plugins
					? JSON.stringify(input.data.recommended_plugins)
					: undefined,
				recommended_tools: input.data.recommended_tools
					? JSON.stringify(input.data.recommended_tools)
					: undefined,
			})
			.where("id", "=", input.id)
			.executeTakeFirst();
	}),
	delete: publicProcedure.input(deleteAssistantInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		await db.deleteFrom("assistant").where("id", "=", input.id).execute();
	}),
});
