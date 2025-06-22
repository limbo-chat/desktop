import type * as limbo from "@limbo/api";
import { useLLMStore } from "./stores";

export function addLLM(llm: limbo.LLM) {
	const llmStore = useLLMStore.getState();

	llmStore.addLLM(llm);
}

export function removeLLM(llmId: string) {
	const llmStore = useLLMStore.getState();

	llmStore.removeLLM(llmId);
}
