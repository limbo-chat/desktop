import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../../../components/button";
import { Field } from "../../../../components/field";
import {
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValue,
} from "../../../../components/select";
import { Tooltip } from "../../../../components/tooltip";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "../../../../features/design-playground/components/component-preview";

export const Route = createFileRoute("/_app/design-playground/elements/tooltip")({
	component: TooltipElementPage,
});

function TooltipElementPage() {
	const [placement, setPlacement] = useState("top");

	return (
		<div className="tooltip-element-page">
			<ComponentPreview>
				<ComponentPreviewContent>
					<Tooltip open label="Tooltip label" contentProps={{ side: placement as any }}>
						<Button>Trigger</Button>
					</Tooltip>
				</ComponentPreviewContent>
				<ComponentPreviewPanel>
					<Field id="placement" label="Placement">
						<SelectRoot value={placement} onValueChange={setPlacement}>
							<SelectTrigger>
								<SelectValue />
								<SelectIcon />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="top">Top</SelectItem>
								<SelectItem value="right">Right</SelectItem>
								<SelectItem value="bottom">Bottom</SelectItem>
								<SelectItem value="left">Left</SelectItem>
							</SelectContent>
						</SelectRoot>
					</Field>
				</ComponentPreviewPanel>
			</ComponentPreview>
		</div>
	);
}
