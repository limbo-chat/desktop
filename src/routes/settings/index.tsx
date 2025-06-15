import { createFileRoute } from "@tanstack/react-router";
import {
	SettingsPage,
	SettingsPageContent,
	SettingsPageDescription,
	SettingsPageHeader,
	SettingsPageTitle,
} from "./-components/settings-page";

export const Route = createFileRoute("/settings/")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	return (
		<SettingsPage data-page="general">
			<SettingsPageHeader>
				<SettingsPageTitle>General</SettingsPageTitle>
				<SettingsPageDescription>General settings</SettingsPageDescription>
			</SettingsPageHeader>
			<SettingsPageContent>todo</SettingsPageContent>
		</SettingsPage>
	);
}
