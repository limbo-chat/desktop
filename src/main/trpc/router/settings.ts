import { settingsSchema } from "../../settings/schemas";
import { readSettings, updateSettings } from "../../settings/utils";
import { publicProcedure, router } from "../trpc";

export const settingsRouter = router({
	get: publicProcedure.query(() => {
		return readSettings();
	}),
	update: publicProcedure.input(settingsSchema.partial()).mutation(({ input }) => {
		return updateSettings(input);
	}),
});
