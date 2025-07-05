import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/button";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
	SettingsSection,
	SettingsSectionContent,
	SettingsSectionHeader,
	SettingsSectionTitle,
} from "../../components/settings";
import { Switch } from "../../components/switch";
import { SettingsPage, SettingsPageContent } from "./-components/settings-page";

export const Route = createFileRoute("/settings/")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	return (
		<SettingsPage data-page="general">
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionHeader>
						<SettingsSectionTitle>App</SettingsSectionTitle>
					</SettingsSectionHeader>
					<SettingsSectionContent>
						<SettingItem id="update">
							<SettingItemInfo>
								<SettingItemTitle>
									Current version: <span className="version">0.0.0</span>
								</SettingItemTitle>
							</SettingItemInfo>
							<SettingItemControl>
								<Button>Check for updates</Button>
							</SettingItemControl>
						</SettingItem>
						<SettingItem id="automatic-updates">
							<SettingItemInfo>
								<SettingItemTitle>Automatic updates</SettingItemTitle>
								<SettingItemDescription>
									Turn this off to prevent the app from checking for updates
								</SettingItemDescription>
							</SettingItemInfo>
							<SettingItemControl>
								<Switch />
							</SettingItemControl>
						</SettingItem>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
