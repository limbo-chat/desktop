import { createFileRoute, Link } from "@tanstack/react-router";
import { Checkbox } from "../../components/checkbox";
import { Field } from "../../components/field";
import {
	SettingsSection,
	SettingsSectionContent,
	SettingsSectionHeader,
	SettingsSectionTitle,
} from "../../components/settings";
import {
	useGetSettingsSuspenseQuery,
	useUpdateSettingsMutation,
} from "../../features/settings/hooks";
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
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	return (
		<SettingsPage data-page="appearance">
			<SettingsPageHeader>
				<SettingsPageTitle>Appearance</SettingsPageTitle>
				<SettingsPageDescription>Customize the and feel of limbo</SettingsPageDescription>
			</SettingsPageHeader>
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<Field
							label="Enable transparency"
							description="Enable transparency for the app window. Performance may take a hit with transparency enabled."
							control={
								<Checkbox
									checked={settings.isTransparencyEnabled}
									onCheckedChange={(checked) => {
										if (typeof checked !== "boolean") {
											return;
										}

										updateSettingsMutation.mutate(
											{
												isTransparencyEnabled: checked,
											},
											{
												onSuccess: () => {
													// todo show toast that says to reload the app
												},
											}
										);
									}}
								/>
							}
						/>
					</SettingsSectionContent>
				</SettingsSection>
				<SettingsSection>
					<SettingsSectionHeader>
						<SettingsSectionTitle>Extras</SettingsSectionTitle>
					</SettingsSectionHeader>
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
