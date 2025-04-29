import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { getPlugin, readPlugins, uninstallPlugin } from "../../plugins/utils";

const getPluginInputSchema = z.object({
	id: z.string(),
});

const uninstallPluginInputSchema = z.object({
	id: z.string(),
});

export const pluginsRouter = router({
	getPluginIds: publicProcedure.query(() => {
		return readPlugins();
	}),
	get: publicProcedure.input(getPluginInputSchema).query(({ input }) => {
		return getPlugin(input.id);
	}),
	uninstall: publicProcedure.input(uninstallPluginInputSchema).mutation(({ input }) => {
		uninstallPlugin(input.id);
	}),
});
