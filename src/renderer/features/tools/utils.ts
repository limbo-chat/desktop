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

export function getToolDefinitionsFromToolMap(
	tools: Map<string, limbo.Tool>
): limbo.ToolDefinition[] {
	const toolDefinitions: limbo.ToolDefinition[] = [];

	for (const tool of tools.values()) {
		toolDefinitions.push({
			id: tool.id,
			description: tool.description,
			schema: tool.schema,
		});
	}

	return toolDefinitions;
}
