import type * as limbo from "@limbo/api";
import { useToolStore } from "./stores";

export function addTool(tool: limbo.Tool) {
	const toolStore = useToolStore.getState();

	toolStore.addTool(tool);
}

export function removeTool(toolId: string) {
	const toolStore = useToolStore.getState();

	toolStore.removeTool(toolId);
}
