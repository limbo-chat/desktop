import { create } from "zustand";
import type * as limbo from "limbo";

export interface ToolStore {
	tools: Map<string, limbo.Tool>;
	addTool: (tool: limbo.Tool) => void;
	removeTool: (toolId: string) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
	tools: new Map(),
	addTool: (tool) => {
		set((state) => {
			const newTools = new Map(state.tools);

			newTools.set(tool.id, tool);

			return { tools: newTools };
		});
	},
	removeTool: (toolId) => {
		set((state) => {
			const newTools = new Map(state.tools);

			newTools.delete(toolId);

			return { tools: newTools };
		});
	},
}));
