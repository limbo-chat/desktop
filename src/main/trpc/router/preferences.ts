import { z } from "zod";
import { getDb } from "../../db/utils";
import { getPreference, setPreference } from "../../preferences/utils";
import { publicProcedure, router } from "../trpc";

const getPreferenceInputSchema = z.object({
	key: z.string(),
});

const setPreferenceInputSchema = z.object({
	key: z.string(),
	value: z.unknown(),
});

export const preferencesRouter = router({
	get: publicProcedure.input(getPreferenceInputSchema).query(async ({ input }) => {
		const db = await getDb();

		return await getPreference(db, input.key);
	}),
	set: publicProcedure.input(setPreferenceInputSchema).mutation(async ({ input }) => {
		const db = await getDb();

		await setPreference(db, input.key, input.value);
	}),
});
