import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { InlineField } from "../../../components/field";
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
		<ComponentPreview>
			<ComponentPreviewContent>
				<Button disabled={isDisabled} isLoading={isLoading}>
					Click me
				</Button>
			</ComponentPreviewContent>
			<ComponentPreviewPanel>
				<InlineField
					label="Disabled?"
					control={
						<Checkbox
							checked={isDisabled}
							onCheckedChange={(e) => setIsDisabled(e.checked as boolean)}
						/>
					}
				/>
				<InlineField
					label="Loading?"
					control={
						<Checkbox
							checked={isLoading}
							onCheckedChange={(e) => setIsLoading(e.checked as boolean)}
						/>
					}
				/>
			</ComponentPreviewPanel>
		</ComponentPreview>
	);
}
