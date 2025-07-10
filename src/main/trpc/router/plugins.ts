import { shell } from "electron";
import { z } from "zod";
import type * as limbo from "@limbo/api";
import { PLUGINS_DIR } from "../../plugins/constants";
import {
	downloadPluginFromGithub,
	getPluginDatabase,
	installPlugin,
	readPlugin,
	readPlugins,
	uninstallPlugin,
	updatePluginMeta,
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
	settings: z.array(
		z.object({
			id: z.string(),
			value: z.any(),
		})
	),
});

const executePluginDatabaseQueryInputSchema = z.object({
	id: z.string(),
	sql: z.string(),
	params: z.array(z.any()).optional(),
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
		updatePluginMeta(input.id, {
			enabled: input.enabled,
		});
	}),
	getSettings: publicProcedure.input(getPluginInputSchema).query(async ({ input }) => {
		const { db } = await getPluginDatabase(input.id);

		const rawSettings = await db.selectFrom("settings").selectAll().execute();

		const parsedSettings = rawSettings.map((setting) => {
			return {
				id: setting.id,
				value: JSON.parse(setting.value),
			};
		});

		return parsedSettings;
	}),
	updateSettings: publicProcedure
		.input(updatePluginSettingsInputSchema)
		.mutation(async ({ input }) => {
			const { db } = await getPluginDatabase(input.id);

			for (const setting of input.settings) {
				await db
					.insertInto("settings")
					.values({
						id: setting.id,
						value: JSON.stringify(setting.value),
					})
					.onConflict((oc) => {
						return oc.doUpdateSet({
							value: JSON.stringify(setting.value),
						});
					})
					.execute();
			}
		}),
	executeDatabaseQuery: publicProcedure
		.input(executePluginDatabaseQueryInputSchema)
		.mutation(async ({ input }) => {
			const { sqlite } = await getPluginDatabase(input.id);

			const stmt = sqlite.prepare(input.sql);

			if (input.params) {
				stmt.bind(...input.params);
			}

			const queryResult: limbo.database.QueryResult = {
				rows: [],
			};

			if (stmt.reader) {
				queryResult.rows = stmt.all();
			} else {
				const res = stmt.run();

				queryResult.rowsAffected = res.changes;

				if (typeof res.lastInsertRowid === "bigint") {
					queryResult.lastInsertId = res.lastInsertRowid;
				} else {
					queryResult.lastInsertId = BigInt(res.lastInsertRowid);
				}
			}

			return queryResult;
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
