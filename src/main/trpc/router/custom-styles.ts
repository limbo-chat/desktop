import { shell } from "electron";
import { z } from "zod";
import { CUSTOM_STYLES_DIR } from "../../custom-styles/constants";
import { readCustomStyle, readCustomStylePaths } from "../../custom-styles/utils";
import { publicProcedure, router } from "../trpc";

const getCustomStyleInputSchema = z.object({
	path: z.string(),
});

export const customStylesRouter = router({
	openFolder: publicProcedure.mutation(() => {
		shell.openPath(CUSTOM_STYLES_DIR);
	}),
	getPaths: publicProcedure.query(async () => {
		return await readCustomStylePaths();
	}),
	get: publicProcedure.input(getCustomStyleInputSchema).query(({ input }) => {
		return readCustomStyle(input.path);
	}),
});
