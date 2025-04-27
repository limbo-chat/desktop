import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { getPlugin, readPlugins } from "../../plugins/utils";

const getPluginInputSchema = z.object({
	id: z.string(),
});

export const pluginsRouter = router({
	getPluginIds: publicProcedure.query(() => {
		return readPlugins();
	}),
	getPlugin: publicProcedure.input(getPluginInputSchema).query(({ input }) => {
		return getPlugin(input.id);
	}),
});
