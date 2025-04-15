import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/button";
import { TextInput } from "../../components/text-input";
import { Field, FieldDescription, FieldInfo, FieldLabel } from "../../components/field";
import "./styles.scss";

export const Route = createFileRoute("/design-playground/")({
	component: DesignPlaygroundPage,
});

function DesignPlaygroundPage() {
	return (
		<div className="">
			<Button color="primary">Button primary</Button>
			<Button color="secondary">Button primary</Button>
			<Field>
				<FieldInfo>
					<FieldLabel>Age</FieldLabel>
					<FieldDescription>This is a basic text field</FieldDescription>
					<TextInput placeholder="Enter your age" />
				</FieldInfo>
			</Field>
		</div>
	);
}
