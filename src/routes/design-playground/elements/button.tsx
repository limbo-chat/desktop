import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { Field } from "../../../components/field";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "../../../features/design-playground/components/component-preview";

export const Route = createFileRoute("/design-playground/elements/button")({
	component: ButtonElementPage,
});

function ButtonElementPage() {
	const [isDisabled, setIsDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="button-element-page">
			<ComponentPreview>
				<ComponentPreviewContent>
					<Button disabled={isDisabled} isLoading={isLoading}>
						Click me
					</Button>
				</ComponentPreviewContent>
				<ComponentPreviewPanel>
					<Field id="disabled" label="Disabled?">
						<Checkbox
							checked={isDisabled}
							onCheckedChange={(isChecked) => setIsDisabled(isChecked as boolean)}
						/>
					</Field>
					<Field id="loading" label="Loading?">
						<Checkbox
							checked={isLoading}
							onCheckedChange={(isChecked) => setIsLoading(isChecked as boolean)}
						/>
					</Field>
				</ComponentPreviewPanel>
			</ComponentPreview>
		</div>
	);
}
