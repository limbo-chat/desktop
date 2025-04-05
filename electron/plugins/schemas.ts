import { z } from "zod";
import semver from "semver";

const semverSchema = z.string().refine((v) => semver.valid(v) !== null, {
	message: "Invalid semver version",
});

export const pluginManifestSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	version: semverSchema,
	minApiVersion: semverSchema.optional(),
	author: z.object({
		name: z.string().optional(),
		email: z.string().optional(),
	}),
	files: z.object({
		js: z.string().default("plugin.js"),
	}),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export const pluginDataSchema = z.object({
	enabled: z.boolean(),
	settings: z.record(z.any()),
});

export type PluginData = z.infer<typeof pluginDataSchema>;
