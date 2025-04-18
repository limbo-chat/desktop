import { z } from "zod";

export const settingsSchema = z.object({
	developerMode: z.boolean(),
});

export type Settings = z.infer<typeof settingsSchema>;
