import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { getPlugins, getPlugin } from "../plugins/utils";

const getPluginInputSchema = z.object({
	id: z.string(),
});

export const pluginsRouter = router({
	getPlugins: publicProcedure.query(async () => {
		return await getPlugins();
	}),
	getPlugin: publicProcedure.input(getPluginInputSchema).query(async ({ input }) => {
		return await getPlugin(input.id);
	}),
});
