import { z } from "zod";
import { readCustomStyle, readCustomStylePaths } from "../../custom-styles/utils";
import { publicProcedure, router } from "../trpc";

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
