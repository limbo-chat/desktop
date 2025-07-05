import { z } from "zod";

const sidebarStateSchema = z.object({
	width: z.number(),
	isOpen: z.boolean(),
});

const workspaceLayoutSchema = z.object({
	primarySidebar: sidebarStateSchema,
	secondarySidebar: sidebarStateSchema,
});

export const workspaceSchema = z.object({
	layout: workspaceLayoutSchema,
});

export type Workspace = z.infer<typeof workspaceSchema>;
