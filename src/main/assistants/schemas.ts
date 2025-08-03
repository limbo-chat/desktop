import { z } from "zod";

export const assistantSchema = z.object({
	id: z.string(),
	name: z.string(),
	tagline: z.string(),
	description: z.string(),
	systemPrompt: z.string(),
	recommendedPlugins: z.array(z.string()),
	recommendedTools: z.array(z.string()),
});

export type Assistant = z.infer<typeof assistantSchema>;
