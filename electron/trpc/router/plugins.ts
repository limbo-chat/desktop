import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
	readPluginIds,
	readPluginJs,
	readPluginManifest,
	uninstallPlugin,
} from "../../plugins/utils";

const getPluginInputSchema = z.object({
	id: z.string(),
});

const uninstallPluginInputSchema = z.object({
	id: z.string(),
});

export const pluginsRouter = router({
	uninstall: publicProcedure.input(uninstallPluginInputSchema).mutation(({ input }) => {
		uninstallPlugin(input.id);
	}),
	getPluginIds: publicProcedure.query(() => {
		return readPluginIds();
	}),
	getManifest: publicProcedure.input(getPluginInputSchema).query(({ input }) => {
		return readPluginManifest(input.id);
	}),
	getJs: publicProcedure.input(getPluginInputSchema).query(({ input }) => {
		return readPluginJs(input.id);
	}),
});
