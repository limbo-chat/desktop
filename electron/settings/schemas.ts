import { z } from "zod";

export const settingsSchema = z.object({
	username: z.string(),
	systemPrompt: z.string(),
	isDeveloperModeEnabled: z.boolean(),
	isTransparencyEnabled: z.boolean(),
});

export type Settings = z.infer<typeof settingsSchema>;
