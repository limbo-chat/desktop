import handlebars from "handlebars";
import { useModalContext } from "../modals/hooks";
import { showModal } from "../modals/utils";
import { AssistantPicker } from "./components/assistant-picker";

export interface RenderSystemPromptContext {
	user: {
		username: string;
	};
}

export function renderSystemPrompt(systemPromptTemplate: string, ctx: RenderSystemPromptContext) {
	const template = handlebars.compile(systemPromptTemplate);

	return template(ctx);
}

export interface ShowAssistantPickerModalOptions {
	selectedAssistantId: string | null;
	onSelect: (assistantId: string) => void;
}

export function showAssistantPickerModal({
	selectedAssistantId,
	onSelect,
}: ShowAssistantPickerModalOptions) {
	showModal({
		id: "llm-picker",
		component: () => {
			const modal = useModalContext();

			const handleOnSelect = (assistantId: string) => {
				modal.close();

				onSelect(assistantId);
			};

			return (
				<AssistantPicker
					initialSelectedAssistantId={selectedAssistantId}
					onSelect={handleOnSelect}
				/>
			);
		},
	});
}
