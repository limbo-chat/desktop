import { z } from "zod";

export const chatNodeSchema = z.object({
	type: z.string(),
	data: z.record(z.any()),
});
