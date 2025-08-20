import type { AppDatabaseClient } from "../db/types";
import { getValue, setValue } from "../kv/utils";
import { workspaceSchema, type Workspace } from "./schemas";

export const defaultWorkspace: Workspace = {
	activeChatId: null,
	layout: {
		primarySidebar: {
			width: 300,
			isOpen: true,
		},
		secondarySidebar: {
			width: 300,
			isOpen: false,
		},
	},
} as const;

export async function saveWorkspace(db: AppDatabaseClient, workspace: Workspace) {
	await setValue(db, "workspace", JSON.stringify(workspace));
}

export async function getWorkspace(db: AppDatabaseClient) {
	const workspaceData = await getValue(db, "workspace");

	if (!workspaceData) {
		await saveWorkspace(db, defaultWorkspace);

		return defaultWorkspace;
	}

	const workspaceParseResult = workspaceSchema.safeParse(workspaceData);

	if (!workspaceParseResult.success) {
		console.log("workspace JSON does not match schema, resetting to default");
		await saveWorkspace(db, defaultWorkspace);

		return defaultWorkspace;
	}

	return workspaceParseResult.data;
}
