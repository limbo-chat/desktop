import { shell } from "electron";
import { z } from "zod";
import type * as limbo from "@limbo/api";
import { PLUGINS_DIR } from "../../plugins/constants";
import {
	downloadPluginFromGithub,
	getPluginDatabase,
	installPlugin,
	readPlugin,
	readPluginMeta,
	readPlugins,
	uninstallPlugin,
	updatePluginMeta,
	writePluginMeta,
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
		const prevData = readPluginMeta(input.id);

		writePluginMeta(input.id, {
			...prevData,
			enabled: input.enabled,
		});
	}),
	updateSettings: publicProcedure.input(updatePluginSettingsInputSchema).mutation(({ input }) => {
		// TODO, new settings logic
	}),
	executeDatabaseQuery: publicProcedure
		.input(executePluginDatabaseQueryInputSchema)
		.mutation(({ input }) => {
			const db = getPluginDatabase(input.id);
			const stmt = db.prepare(input.sql);

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
