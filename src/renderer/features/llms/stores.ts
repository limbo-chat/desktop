import type * as limbo from "@limbo/api";
import { create } from "zustand";

export interface LLMStore {
	llms: Map<string, limbo.LLM>;
	addLLM: (llm: limbo.LLM) => void;
	removeLLM: (llmId: string) => void;
}

export const useLLMStore = create<LLMStore>((set) => ({
	llms: new Map(),
	addLLM: (llm) => {
		set((state) => {
			const newTools = new Map(state.llms);

			newTools.set(llm.id, llm);

			return { llms: newTools };
		});
	},
	removeLLM: (llmId) => {
		set((state) => {
			const newTools = new Map(state.llms);

			newTools.delete(llmId);

			return { llms: newTools };
		});
	},
}));
