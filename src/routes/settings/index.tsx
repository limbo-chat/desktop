import { createFileRoute, Link } from "@tanstack/react-router";
import { Field, FieldDescription, FieldInfo, FieldLabel } from "../../components/field";
import { TextInput } from "../../components/text-input";

export const Route = createFileRoute("/settings/")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	return (
		<div>
			<Link to="/design-system">open design system playground</Link>
		</div>
	);
}
