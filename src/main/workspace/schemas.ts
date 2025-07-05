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
	activeChatId: z.string().nullable(),
	layout: workspaceLayoutSchema,
});

export type Workspace = z.infer<typeof workspaceSchema>;
