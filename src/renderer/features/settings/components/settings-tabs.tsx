import { useShallow } from "zustand/shallow";
import { Button } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
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
} from "../../../components/settings";
import { Switch } from "../../../components/switch";
import * as VerticalTabs from "../../../components/vertical-tabs-primitive";
import { useMainRouterClient } from "../../../lib/trpc";
import { AssistantViewStack } from "../../assistants/components/assistant-view-stack";
import { useDeleteAllChatsMutation } from "../../chat/hooks/queries";
import { showNotification } from "../../notifications/utils";
import { PluginViewStack } from "../../plugins/components/plugin-view-stack";
import { useSyncedPreference } from "../../preferences/hooks";
import { useGetSettingsSuspenseQuery, useUpdateSettingsMutation } from "../hooks";
import { useSettingsTabsStore } from "../stores";

const GeneralTabContent = () => {
	return (
		<>
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
			<SettingsSection>
				<SettingsSectionHeader>
					<SettingsSectionTitle>Help</SettingsSectionTitle>
				</SettingsSectionHeader>
				<SettingsSectionContent>
					<SettingItem id="join-discord">
						<SettingItemInfo>
							<SettingItemTitle>Discord</SettingItemTitle>
							<SettingItemDescription>
								Join our Discord community to chat with other Limbo users and
								developers.
							</SettingItemDescription>
						</SettingItemInfo>
						<SettingItemControl>
							<Button
								onClick={() => window.open(window.env.DISCORD_INVITE_URL, "_blank")}
							>
								Join
							</Button>
						</SettingItemControl>
					</SettingItem>
				</SettingsSectionContent>
			</SettingsSection>
		</>
	);
};

const PersonalizationTabContent = () => {
	const [username, setUsername] = useSyncedPreference("username");

	return (
		<SettingsSection>
			<SettingsSectionContent>
				<SettingItem id="username">
					<SettingItemInfo>
						<SettingItemTitle>Username</SettingItemTitle>
						<SettingItemDescription>
							What would you like to be called?
						</SettingItemDescription>
					</SettingItemInfo>
					<SettingItemControl>
						<input
							type="text"
							placeholder="Enter your name"
							value={username ?? ""}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</SettingItemControl>
				</SettingItem>
			</SettingsSectionContent>
		</SettingsSection>
	);
};

const DataTabContent = () => {
	const deleteAllChatsMutation = useDeleteAllChatsMutation();

	const handleDeleteAllChats = () => {
		deleteAllChatsMutation.mutate();
	};

	return (
		<SettingsSection>
			<SettingsSectionContent>
				<SettingItem data-setting="delete-chats">
					<SettingItemInfo>
						<SettingItemTitle>Delete chats</SettingItemTitle>
						<SettingItemDescription>
							Delete all chats. This action cannot be undone.
						</SettingItemDescription>
					</SettingItemInfo>
					<SettingItemControl>
						<Button action="delete-chats" onClick={handleDeleteAllChats}>
							Delete chats
						</Button>
					</SettingItemControl>
				</SettingItem>
			</SettingsSectionContent>
		</SettingsSection>
	);
};

const AppearanceTabContent = () => {
	const mainRouterClient = useMainRouterClient();
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	const openCustomStylesFolder = () => {
		mainRouterClient.customStyles.openFolder.mutate();
	};

	return (
		<SettingsSection>
			<SettingsSectionContent>
				<SettingItem>
					<SettingItemInfo>
						<SettingItemTitle>Enable transparency</SettingItemTitle>
						<SettingItemDescription>
							Enable transparency for the app window. Performance may take a hit with
							transparency enabled.
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
													level: "info",
													title: "Transparency enabled",
													message: "Restart the app to apply changes",
												});
											} else {
												showNotification({
													level: "info",
													title: "Transparency disabled",
													message: "Restart the app to apply changes",
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
	);
};

const DeveloperTabContent = () => {
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	return (
		<SettingsSection>
			<SettingsSectionContent>
				<SettingItem>
					<SettingItemInfo>
						<SettingItemTitle>Enable developer mode</SettingItemTitle>
						<SettingItemDescription>
							Developer mode enables hot reloading of plugins and custom styles
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
													level: "info",
													title: "Developer mode enabled",
													message: "Restart the app to apply changes",
												});
											} else {
												showNotification({
													level: "info",
													title: "Developer mode disabled",
													message: "Restart the app to apply changes",
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
	);
};

const AssistantsTabContent = () => {
	return <AssistantViewStack />;
};

const PluginsTabContent = () => {
	return <PluginViewStack />;
};

export const SettingsTabs = () => {
	const settingsTabsStore = useSettingsTabsStore(
		useShallow((state) => ({
			activeTab: state.activeTab,
			setActiveTab: state.setActiveTab,
		}))
	);

	return (
		<VerticalTabs.Root
			defaultValue="general"
			value={settingsTabsStore.activeTab ?? undefined}
			onValueChange={settingsTabsStore.setActiveTab}
		>
			<VerticalTabs.List>
				<VerticalTabs.ListSection>
					<VerticalTabs.ListSectionHeader>
						<VerticalTabs.ListSectionTitle>Options</VerticalTabs.ListSectionTitle>
					</VerticalTabs.ListSectionHeader>
					<VerticalTabs.ListSectionContent>
						<VerticalTabs.ListSectionItem value="general">
							General
						</VerticalTabs.ListSectionItem>
						<VerticalTabs.ListSectionItem value="personalization">
							Personalization
						</VerticalTabs.ListSectionItem>
						<VerticalTabs.ListSectionItem value="data">
							Data
						</VerticalTabs.ListSectionItem>
						<VerticalTabs.ListSectionItem value="appearance">
							Appearance
						</VerticalTabs.ListSectionItem>
						<VerticalTabs.ListSectionItem value="developer">
							Developer
						</VerticalTabs.ListSectionItem>
						<VerticalTabs.ListSectionItem value="assistants">
							Assistants
						</VerticalTabs.ListSectionItem>
						<VerticalTabs.ListSectionItem value="plugins">
							Plugins
						</VerticalTabs.ListSectionItem>
					</VerticalTabs.ListSectionContent>
				</VerticalTabs.ListSection>
			</VerticalTabs.List>
			<VerticalTabs.Content value="general">
				<GeneralTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="personalization">
				<PersonalizationTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="data">
				<DataTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="appearance">
				<AppearanceTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="developer">
				<DeveloperTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="assistants">
				<AssistantsTabContent />
			</VerticalTabs.Content>
			<VerticalTabs.Content value="plugins">
				<PluginsTabContent />
			</VerticalTabs.Content>
		</VerticalTabs.Root>
	);
};
