import { createFileRoute } from "@tanstack/react-router";
import { Field, FieldDescription, FieldInfo, FieldLabel } from "../../components/field";
import { TextInput } from "../../components/text-input";

export const Route = createFileRoute("/settings/")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	return (
		<div>
			<Field>
				<FieldInfo>
					<FieldLabel>Age</FieldLabel>
					<FieldDescription>
						Your age is used to calculate your zodiac sign.
					</FieldDescription>
				</FieldInfo>
				<TextInput placeholder="Enter your age" />
			</Field>
		</div>
	);
}
