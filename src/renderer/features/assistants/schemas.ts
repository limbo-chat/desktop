import { z } from "zod";

export const baseAssistantFormSchema = z.object({
	name: z.string().min(1, "A name is required"),
	tagline: z.string().min(1, "A tagline is required"),
	description: z.string().min(1, "A description is required"),
	system_prompt: z.string().min(1, "A system prompt is required"),
	recommended_plugins: z.array(z.string()),
	recommended_tools: z.array(z.string()),
});
