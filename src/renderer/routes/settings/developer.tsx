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
import { showNotification } from "../../features/notifications/utils";
import {
	useGetSettingsSuspenseQuery,
	useUpdateSettingsMutation,
} from "../../features/settings/hooks";
import { SettingsPage, SettingsPageContent } from "./-components/settings-page";

export const Route = createFileRoute("/settings/developer")({
	component: DeveloperSettingsPage,
});

function DeveloperSettingsPage() {
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	return (
		<SettingsPage data-page="developer">
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<SettingItem>
							<SettingItemInfo>
								<SettingItemTitle>Enable developer mode</SettingItemTitle>
								<SettingItemDescription>
									Developer mode enables hot reloading of plugins and custom
									styles
								</SettingItemDescription>
							</SettingItemInfo>
							<SettingItemControl>
								<Checkbox
									checked={settings.isDeveloperModeEnabled}
									onCheckedChange={(isChecked) => {
										if (typeof isChecked !== "boolean") {
											return;
										}

										updateSettingsMutation.mutate(
											{
												isDeveloperModeEnabled: isChecked,
											},
											{
												onSuccess: (newSettings) => {
													if (newSettings.isDeveloperModeEnabled) {
														showNotification({
															title: "Developer mode enabled",
															message:
																"Restart the app to apply changes",
														});
													} else {
														showNotification({
															title: "Developer mode disabled",
															message:
																"Restart the app to apply changes",
														});
													}
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
