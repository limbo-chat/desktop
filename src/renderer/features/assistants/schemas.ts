import { z } from "zod";

export const baseAssistantFormSchema = z.object({
	name: z.string().min(1, "A name is required"),
	tagline: z.string().min(1, "A tagline is required"),
	description: z.string().min(1, "A description is required"),
	systemPrompt: z.string().min(1, "A system prompt is required"),
	recommendedPlugins: z.array(z.string()),
	recommendedTools: z.array(z.string()),
});
