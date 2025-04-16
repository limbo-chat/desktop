import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	return <div>General settings</div>;
}
