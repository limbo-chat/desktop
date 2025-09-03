import { app, shell } from "electron";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const openUrlInputSchema = z.object({
	url: z.string().url(),
});

export const commonRouter = router({
	getAppVersion: publicProcedure.query(() => {
		return app.getVersion();
	}),
	openUrl: publicProcedure.input(openUrlInputSchema).mutation(async ({ input }) => {
		await shell.openExternal(input.url);
	}),
});
