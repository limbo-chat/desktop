import { z } from "zod";

export const assistantSchema = z.object({
	id: z.string(),
	name: z.string(),
	tagline: z.string(),
	description: z.string(),
	system_prompt: z.string(),
	recommended_plugins: z.array(z.string()),
	recommended_tools: z.array(z.string()),
});

export type Assistant = z.infer<typeof assistantSchema>;
