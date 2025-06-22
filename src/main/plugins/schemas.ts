import semver from "semver";
import { z } from "zod";

const semverSchema = z.string().refine((v) => semver.validRange(v) !== null, {
	message: "Invalid semver version",
});

export const pluginManifestSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	version: semverSchema,
	apiVersion: semverSchema.optional(),
	author: z.object({
		name: z.string(),
		email: z.string(),
	}),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export const pluginDataSchema = z.object({
	enabled: z.boolean(),
	settings: z.record(z.any()),
});

export type PluginData = z.infer<typeof pluginDataSchema>;
