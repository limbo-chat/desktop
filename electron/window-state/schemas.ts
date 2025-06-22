import { z } from "zod";

export const windowStateSchema = z.object({
	x: z.number(),
	y: z.number(),
	width: z.number(),
	height: z.number(),
});

export type WindowState = z.infer<typeof windowStateSchema>;
