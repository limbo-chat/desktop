import { createFileRoute, Link } from "@tanstack/react-router";
import { SettingsSection, SettingsSectionContent } from "../../components/settings";
import {
	SettingsPage,
	SettingsPageContent,
	SettingsPageDescription,
	SettingsPageHeader,
	SettingsPageTitle,
} from "./-components/settings-page";

export const Route = createFileRoute("/settings/appearance")({
	component: AppearanceSettingsPage,
});

function AppearanceSettingsPage() {
	return (
		<SettingsPage data-page="appearance">
			<SettingsPageHeader>
				<SettingsPageTitle>Appearance</SettingsPageTitle>
				<SettingsPageDescription>Customize the and feel of limbo</SettingsPageDescription>
			</SettingsPageHeader>
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<Link className="button" to="/design-playground">
							Open design playground
						</Link>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
