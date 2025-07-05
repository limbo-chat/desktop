import fs from "node:fs";
import { WORKSPACE_FILE_PATH } from "./constants";
import { workspaceSchema, type Workspace } from "./schemas";

export const defaultWorkspace: Workspace = {
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

export function writeWorkspace(workspace: Workspace) {
	fs.writeFileSync(WORKSPACE_FILE_PATH, JSON.stringify(workspace));
}

export function ensureWorkspace() {
	if (!fs.existsSync(WORKSPACE_FILE_PATH)) {
		writeWorkspace(defaultWorkspace);
	}
}

export function readWorkspace(): Workspace {
	let workspaceStr;

	try {
		workspaceStr = fs.readFileSync(WORKSPACE_FILE_PATH, "utf8");
	} catch {
		writeWorkspace(defaultWorkspace);

		return defaultWorkspace;
	}

	let rawWorkspace;

	try {
		rawWorkspace = JSON.parse(workspaceStr);
	} catch {
		writeWorkspace(defaultWorkspace);

		return defaultWorkspace;
	}

	const workspaceParseResult = workspaceSchema.safeParse(rawWorkspace);

	if (!workspaceParseResult.success) {
		writeWorkspace(defaultWorkspace);

		return defaultWorkspace;
	}

	return workspaceParseResult.data;
}
