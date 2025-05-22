import { shell } from "electron";
import { set, z } from "zod";
import { PLUGINS_DIR } from "../../plugins/constants";
import {
	downloadPluginFromGithub,
	installPlugin,
	readPlugin,
	readPluginData,
	readPlugins,
	uninstallPlugin,
	updatePluginData,
	writePluginData,
} from "../../plugins/utils";
import { publicProcedure, router } from "../trpc";

const getPluginInputSchema = z.object({
	id: z.string(),
});

const updatePluginEnabledInputSchema = z.object({
	id: z.string(),
	enabled: z.boolean(),
});

const updatePluginSettingsInputSchema = z.object({
	id: z.string(),
	settings: z.record(z.string(), z.unknown()),
});

const installPluginInputSchema = z.object({
	repo: z.string(),
	owner: z.string(),
});

const uninstallPluginInputSchema = z.object({
	id: z.string(),
});

export const pluginsRouter = router({
	openFolder: publicProcedure.mutation(() => {
		shell.openPath(PLUGINS_DIR);
	}),
	get: publicProcedure.input(getPluginInputSchema).query(({ input }) => {
		return readPlugin(input.id);
	}),
	getAll: publicProcedure.query(() => {
		return readPlugins();
	}),
	updateEnabled: publicProcedure.input(updatePluginEnabledInputSchema).mutation(({ input }) => {
		const prevData = readPluginData(input.id);

		writePluginData(input.id, {
			...prevData,
			enabled: input.enabled,
		});
	}),
	updateSettings: publicProcedure.input(updatePluginSettingsInputSchema).mutation(({ input }) => {
		updatePluginData(input.id, {
			settings: input.settings,
		});
	}),
	install: publicProcedure.input(installPluginInputSchema).mutation(async ({ input }) => {
		const downloadResult = await downloadPluginFromGithub(input);

		installPlugin(downloadResult);

		return downloadResult.manifest;
	}),
	uninstall: publicProcedure.input(uninstallPluginInputSchema).mutation(({ input }) => {
		uninstallPlugin(input.id);
	}),
});
