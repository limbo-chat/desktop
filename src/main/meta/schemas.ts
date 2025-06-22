import { z } from "zod";

export const metaSchema = z.object({
	dataVersion: z.number().int().min(1),
});

export type Meta = z.infer<typeof metaSchema>;
