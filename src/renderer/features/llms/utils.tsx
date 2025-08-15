import type * as limbo from "@limbo/api";
import { useModalContext } from "../modals/hooks";
import { showModal } from "../modals/utils";
import { LLMPicker } from "./components/llm-picker";
import { useLLMStore } from "./stores";

export function addLLM(llm: limbo.LLM) {
	const llmStore = useLLMStore.getState();

	llmStore.addLLM(llm);
}

export function removeLLM(llmId: string) {
	const llmStore = useLLMStore.getState();

	llmStore.removeLLM(llmId);
}

export interface ShowLLMPickerModalOptions {
	selectedLLMId: string | null;
	onSelect: (llmId: string) => void;
}

export function showLLMPickerModal({ selectedLLMId, onSelect }: ShowLLMPickerModalOptions) {
	showModal({
		id: "llm-picker",
		component: () => {
			const modal = useModalContext();

			const handleOnSelect = (llmId: string) => {
				modal.close();

				onSelect(llmId);
			};

			return <LLMPicker initialSelectedLLMId={selectedLLMId} onSelect={handleOnSelect} />;
		},
	});
}
