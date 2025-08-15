import { useState } from "react";
import type * as limbo from "@limbo/api";
import { useModalContext } from "../modals/hooks";
import { showModal } from "../modals/utils";
import { ToolPicker } from "./components/tool-picker";
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

export interface ShowToolPickerModalOptions {
	initialSelectedToolIds: string[];
	onSubmit: (selectedToolIds: string[]) => void;
}

export function showToolPickerModal({
	initialSelectedToolIds,
	onSubmit,
}: ShowToolPickerModalOptions) {
	showModal({
		id: "tool-picker",
		component: () => {
			const modal = useModalContext();

			const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(
				new Set(initialSelectedToolIds)
			);

			const handleSubmit = () => {
				modal.close();

				onSubmit(Array.from(selectedToolIds));
			};

			return (
				<ToolPicker
					selectedToolIds={selectedToolIds}
					onSelectedToolIdsChange={setSelectedToolIds}
					onSubmit={handleSubmit}
				/>
			);
		},
	});
}
