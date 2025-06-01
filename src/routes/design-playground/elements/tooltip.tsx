import { createListCollection } from "@ark-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../../components/button";
import { Field } from "../../../components/field";
import {
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValue,
} from "../../../components/select";
import { Tooltip } from "../../../components/tooltip";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "../../../features/design-playground/components/component-preview";

export const Route = createFileRoute("/design-playground/elements/tooltip")({
	component: TooltipElementPage,
});

function TooltipElementPage() {
	const [placement, setPlacement] = useState("top");

	return (
		<div className="tooltip-element-page">
			<ComponentPreview>
				<ComponentPreviewContent>
					<Tooltip
						open
						label="Tooltip label"
						positioning={{ placement: placement as any }}
					>
						<Button>Trigger</Button>
					</Tooltip>
				</ComponentPreviewContent>
				<ComponentPreviewPanel>
					<Field
						label="Placement"
						control={
							<SelectRoot value={placement} onValueChange={setPlacement}>
								<SelectTrigger>
									<SelectValue />
									<SelectIcon />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="top">Top</SelectItem>
									<SelectItem value="top-start">Top start</SelectItem>
									<SelectItem value="top-end">Top end</SelectItem>
									<SelectItem value="bottom">Bottom</SelectItem>
									<SelectItem value="bottom-start">Bottom start</SelectItem>
									<SelectItem value="bottom-end">Bottom end</SelectItem>
									<SelectItem value="left">Left</SelectItem>
									<SelectItem value="left-start">Left start</SelectItem>
									<SelectItem value="left-end">Left end</SelectItem>
									<SelectItem value="right">Right</SelectItem>
									<SelectItem value="right-start">Right start</SelectItem>
									<SelectItem value="right-end">Right end</SelectItem>
								</SelectContent>
							</SelectRoot>
						}
					/>
				</ComponentPreviewPanel>
			</ComponentPreview>
		</div>
	);
}
