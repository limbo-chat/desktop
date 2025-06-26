import { createFileRoute } from "@tanstack/react-router";
import {
	ComponentPreview,
	ComponentPreviewContent,
} from "../../../../features/design-playground/components/component-preview";
import { LLMPicker } from "../../../../features/llms/components/llm-picker";
import { useLLMList } from "../../../../features/llms/hooks";

export const Route = createFileRoute("/_app/design-playground/elements/llm-picker")({
	component: LLMPickerElementPage,
});

function LLMPickerElementPage() {
	const llms = useLLMList();

	return (
		<div className="tooltip-element-page">
			<ComponentPreview>
				<ComponentPreviewContent>
					<LLMPicker llms={llms} onChange={console.log} />
				</ComponentPreviewContent>
			</ComponentPreview>
		</div>
	);
}
