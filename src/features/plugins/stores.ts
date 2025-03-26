import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface LLMElement {
	id: string;
	name: string;
	description: string;
}

export interface ToolbarToggleButtonElement {
	id: string;
	label: string;
	tooltip?: string;
}

export interface StorePlugin {
	id: string;
	llms: LLMElement[];
	toolbarToggleButtons: ToolbarToggleButtonElement[];
}

export interface PluginElementStore {
	// llms: LLMElement[];
	// toolbarToggleButtons: ToolbarToggleButtonElement[];
	// addLLM: (llm: LLMElement) => void;
	// removeLLM: (llmId: string) => void;
	// addToolbarToggleButton: (button: ToolbarToggleButtonElement) => void;
	// removeToolbarToggleButton: (toolbarToggleButtonId: string) => void;
	plugins: [];
}

export const usePluginStore = create(
	immer<PluginElementStore>((set) => ({
		plugins: [],
	}))
);
