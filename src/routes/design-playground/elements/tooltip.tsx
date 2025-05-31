import { createListCollection } from "@ark-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../../components/button";
import { Field } from "../../../components/field";
import { SimpleSelect, SimpleSelectItem } from "../../../components/select";
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
	const [placement, setPlacement] = useState<string>("top");

	const placementCollection = createListCollection({
		items: [
			{ value: "top", label: "Top" },
			{ value: "top-start", label: "Top start" },
			{ value: "top-end", label: "Top end" },
			{ value: "bottom", label: "Bottom" },
			{ value: "bottom-start", label: "Bottom start" },
			{ value: "bottom-end", label: "Bottom end" },
			{ value: "left", label: "Left" },
			{ value: "left-start", label: "Left start" },
			{ value: "left-end", label: "Left end" },
			{ value: "right", label: "Right" },
			{ value: "right-start", label: "Right start" },
			{ value: "right-end", label: "Right end" },
		],
	});

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
							<SimpleSelect
								value={[placement]}
								collection={placementCollection}
								onValueChange={(e) => setPlacement(e.value[0])}
							>
								{placementCollection.items.map((item) => (
									<SimpleSelectItem
										item={item}
										label={item.label}
										key={item.value}
									/>
								))}
							</SimpleSelect>
						}
					/>
				</ComponentPreviewPanel>
			</ComponentPreview>
		</div>
	);
}
