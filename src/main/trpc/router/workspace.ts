import { workspaceSchema } from "../../workspace/schemas";
import { readWorkspace, writeWorkspace } from "../../workspace/utils";
import { publicProcedure, router } from "../trpc";

export const workspaceRouter = router({
	get: publicProcedure.query(() => {
		return readWorkspace();
	}),
	set: publicProcedure.input(workspaceSchema).mutation(({ input }) => {
		writeWorkspace(input);
	}),
});
