import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "./-components/settings-page";

export const Route = createFileRoute("/settings/")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	return <SettingsPage className="general-settings-page">general settings</SettingsPage>;
}
