import { createFileRoute } from "@tanstack/react-router";
import { Checkbox } from "../../components/checkbox";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
	SettingsSection,
	SettingsSectionContent,
} from "../../components/settings";
import {
	useGetSettingsSuspenseQuery,
	useUpdateSettingsMutation,
} from "../../features/settings/hooks";
import { SettingsPage, SettingsPageContent } from "./-components/settings-page";

export const Route = createFileRoute("/settings/appearance")({
	component: AppearanceSettingsPage,
});

function AppearanceSettingsPage() {
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	return (
		<SettingsPage data-page="appearance">
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<SettingItem>
							<SettingItemInfo>
								<SettingItemTitle>Enable transparency</SettingItemTitle>
								<SettingItemDescription>
									Enable transparency for the app window. Performance may take a
									hit with transparency enabled.
								</SettingItemDescription>
							</SettingItemInfo>
							<SettingItemControl>
								<Checkbox
									checked={settings.isTransparencyEnabled}
									onCheckedChange={(isChecked) => {
										if (typeof isChecked !== "boolean") {
											return;
										}

										updateSettingsMutation.mutate(
											{
												isTransparencyEnabled: isChecked,
											},
											{
												onSuccess: () => {
													// todo show toast that says to reload the app
												},
											}
										);
									}}
								/>
							</SettingItemControl>
						</SettingItem>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
