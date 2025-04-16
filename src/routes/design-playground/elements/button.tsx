import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/button";
import {
	ComponentPreview,
	ComponentPreviewContent,
	ComponentPreviewPanel,
} from "../../../features/design-playground/components/component-preview";
import { Field, FieldLabel } from "../../../components/field";
import {
	SelectItem,
	SelectItemText,
	SelectItemIndicator,
	Select,
} from "../../../components/select";
import { createListCollection } from "@ark-ui/react";
import { HeartIcon } from "lucide-react";

export const Route = createFileRoute("/design-playground/elements/button")({
	component: ButtonElementPage,
});

function ButtonElementPage() {
	const [buttonColor, setButtonColor] = useState("primary");
	const [buttonVariant, setButtonVariant] = useState("default");
	const [buttonSize, setButtonSize] = useState("md");

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

	const buttonSizeCollection = createListCollection({
		items: [
			{
				value: "md",
				label: "Medium",
			},
			{
				value: "icon",
				label: "Icon",
			},
		],
	});

	return (
		<div>
			<ComponentPreview>
				<ComponentPreviewContent>
					<Button
						color={buttonColor as any}
						variant={buttonVariant as any}
						size={buttonSize as any}
					>
						{buttonSize === "icon" ? <HeartIcon /> : "Click me"}
					</Button>
				</ComponentPreviewContent>
				<ComponentPreviewPanel>
					<Field>
						<FieldLabel>Color</FieldLabel>
						<Select
							collection={buttonColorCollection}
							value={[buttonColor]}
							onValueChange={(e) => setButtonColor(e.value[0])}
						>
							{buttonColorCollection.items.map((item) => (
								<SelectItem item={item} key={item.value}>
									<SelectItemText>{item.label}</SelectItemText>
									<SelectItemIndicator />
								</SelectItem>
							))}
						</Select>
					</Field>
					<Field>
						<FieldLabel>Variant</FieldLabel>
						<Select
							value={[buttonVariant]}
							collection={buttonVariantCollection}
							onValueChange={(e) => setButtonVariant(e.value[0])}
						>
							{buttonVariantCollection.items.map((item) => (
								<SelectItem item={item} key={item.value}>
									<SelectItemText>{item.label}</SelectItemText>
									<SelectItemIndicator />
								</SelectItem>
							))}
						</Select>
					</Field>
					<Field>
						<FieldLabel>Size</FieldLabel>
						<Select
							value={[buttonSize]}
							collection={buttonSizeCollection}
							onValueChange={(e) => setButtonSize(e.value[0])}
						>
							{buttonSizeCollection.items.map((item) => (
								<SelectItem item={item} key={item.value}>
									<SelectItemText>{item.label}</SelectItemText>
									<SelectItemIndicator />
								</SelectItem>
							))}
						</Select>
					</Field>
				</ComponentPreviewPanel>
			</ComponentPreview>
		</div>
	);
}
