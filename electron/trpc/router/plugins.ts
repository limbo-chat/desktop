import { shell } from "electron";
import { z } from "zod";
import { PLUGINS_DIR } from "../../plugins/constants";
import {
	downloadPluginFromGithub,
	installPlugin,
	readPluginData,
	readPluginIds,
	readPluginJs,
	readPluginManifest,
	uninstallPlugin,
} from "../../plugins/utils";
import { publicProcedure, router } from "../trpc";

const getPluginInputSchema = z.object({
	id: z.string(),
});

const installPluginInputSchema = z.object({
	repo: z.string(),
	owner: z.string(),
});

const uninstallPluginInputSchema = z.object({
	id: z.string(),
});

export const pluginsRouter = router({
	install: publicProcedure.input(installPluginInputSchema).mutation(async ({ input }) => {
		const downloadResult = await downloadPluginFromGithub(input);

		installPlugin(downloadResult);

		return downloadResult.manifest;
	}),
	uninstall: publicProcedure.input(uninstallPluginInputSchema).mutation(({ input }) => {
		uninstallPlugin(input.id);
	}),
	openFolder: publicProcedure.mutation(() => {
		shell.openPath(PLUGINS_DIR);
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
	getData: publicProcedure.input(getPluginInputSchema).query(({ input }) => {
		return readPluginData(input.id);
	}),
});
