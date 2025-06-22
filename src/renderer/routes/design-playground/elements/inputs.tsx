import { createFileRoute } from "@tanstack/react-router";
import { PasswordInput } from "../../../components/inputs/password-input";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "../../../features/design-playground/components/component-preview";

export const Route = createFileRoute("/design-playground/elements/inputs")({
	component: InputElementsPage,
});

function InputElementsPage() {
	return (
		<div className="input-elements-page">
			<ComponentPreview>
				<ComponentPreviewContent>
					<PasswordInput placeholder="Enter password" />
				</ComponentPreviewContent>
				<ComponentPreviewPanel></ComponentPreviewPanel>
			</ComponentPreview>
		</div>
	);
}
