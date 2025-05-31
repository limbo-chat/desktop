import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NumberInput } from "../../../components/inputs/number-input";
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
	const [numberValue, setNumberValue] = useState(0);

	return (
		<ComponentPreview>
			<ComponentPreviewContent>
				<PasswordInput placeholder="Enter password" />
				<NumberInput value={numberValue} onChange={setNumberValue} min={0} max={5} />
			</ComponentPreviewContent>
			<ComponentPreviewPanel></ComponentPreviewPanel>
		</ComponentPreview>
	);
}
