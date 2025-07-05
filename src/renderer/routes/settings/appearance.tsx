import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/button";
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
import { useMainRouterClient } from "../../lib/trpc";
import { SettingsPage, SettingsPageContent } from "./-components/settings-page";

export const Route = createFileRoute("/settings/appearance")({
	component: AppearanceSettingsPage,
});

function AppearanceSettingsPage() {
	const mainRouterClient = useMainRouterClient();
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	const openCustomStylesFolder = () => {
		mainRouterClient.customStyles.openFolder.mutate();
	};

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
												onSuccess: (newSettings) => {
													if (newSettings.isTransparencyEnabled) {
														showNotification({
															title: "Transparency enabled",
															message:
																"Restart the app to apply changes",
														});
													} else {
														showNotification({
															title: "Transparency disabled",
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
						<SettingItem>
							<SettingItemInfo>
								<SettingItemTitle>Open custom styles</SettingItemTitle>
								<SettingItemDescription>
									Custom styles are CSS files stored in a folder on your computer.
								</SettingItemDescription>
							</SettingItemInfo>
							<SettingItemControl>
								<Button onClick={openCustomStylesFolder}>Open folder</Button>
							</SettingItemControl>
						</SettingItem>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
