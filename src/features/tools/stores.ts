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

export interface ToolCallStore {
	toolCalls: Map<string, limbo.ToolCall>;
	addToolCall: (toolCall: limbo.ToolCall) => void;
	removeToolCall: (toolCallId: string) => void;
	reset: () => void;
}

export const useToolCallStore = create<ToolCallStore>((set) => ({
	toolCalls: new Map(),
	addToolCall: (toolCall) => {
		set((state) => {
			const newToolCalls = new Map(state.toolCalls);

			newToolCalls.set(toolCall.id, toolCall);

			return { toolCalls: newToolCalls };
		});
	},
	removeToolCall: (toolCallId) => {
		set((state) => {
			const newToolCalls = new Map(state.toolCalls);

			newToolCalls.delete(toolCallId);

			return { toolCalls: newToolCalls };
		});
	},
	reset: () => set({ toolCalls: new Map() }),
}));
