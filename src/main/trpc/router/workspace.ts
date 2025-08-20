import { getDb } from "../../db/utils";
import { workspaceSchema } from "../../workspace/schemas";
import { getWorkspace, saveWorkspace } from "../../workspace/utils";
import { publicProcedure, router } from "../trpc";

export const workspaceRouter = router({
	get: publicProcedure.query(async () => {
		const db = await getDb();

		return await getWorkspace(db);
	}),
	set: publicProcedure.input(workspaceSchema).mutation(async ({ input }) => {
		const db = await getDb();

		await saveWorkspace(db, input);
	}),
});
