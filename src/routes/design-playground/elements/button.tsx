import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/button";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "../../../features/design-playground/components/component-preview";
import { Field, FieldLabel } from "../../../components/field";
import { SimpleSelect, SimpleSelectItem } from "../../../components/select";
import { createListCollection } from "@ark-ui/react";

export const Route = createFileRoute("/design-playground/elements/button")({
	component: ButtonElementPage,
});

function ButtonElementPage() {
	const [buttonColor, setButtonColor] = useState("primary");
	const [buttonVariant, setButtonVariant] = useState("default");

	const buttonColorCollection = createListCollection({
		items: [
			{ value: "primary", label: "Primary" },
			{ value: "secondary", label: "Secondary" },
		],
	});

	const buttonVariantCollection = createListCollection({
		items: [
			{
				value: "default",
				label: "Default",
			},
			{
				value: "ghost",
				label: "Ghost",
			},
		],
	});

	return (
		<ComponentPreview>
			<ComponentPreviewContent>
				<Button color={buttonColor as any} variant={buttonVariant as any}>
					Click me
				</Button>
			</ComponentPreviewContent>
			<ComponentPreviewPanel>
				<Field>
					<FieldLabel>Color</FieldLabel>
					<SimpleSelect
						collection={buttonColorCollection}
						value={[buttonColor]}
						onValueChange={(e) => setButtonColor(e.value[0])}
					>
						{buttonColorCollection.items.map((item) => (
							<SimpleSelectItem item={item} label={item.label} key={item.value} />
						))}
					</SimpleSelect>
				</Field>
				<Field>
					<FieldLabel>Variant</FieldLabel>
					<SimpleSelect
						value={[buttonVariant]}
						collection={buttonVariantCollection}
						onValueChange={(e) => setButtonVariant(e.value[0])}
					>
						{buttonVariantCollection.items.map((item) => (
							<SimpleSelectItem item={item} label={item.label} key={item.value} />
						))}
					</SimpleSelect>
				</Field>
			</ComponentPreviewPanel>
		</ComponentPreview>
	);
}
