import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { readCustomStyle, readCustomStylePaths } from "../../custom-styles/utils";

const getCustomStyleInputSchema = z.object({
	path: z.string(),
});

export const customStylesRouter = router({
	getPaths: publicProcedure.query(async () => {
		return await readCustomStylePaths();
	}),
	get: publicProcedure.input(getCustomStyleInputSchema).query(({ input }) => {
		return readCustomStyle(input.path);
	}),
});
