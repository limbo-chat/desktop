import { zodResolver } from "@hookform/resolvers/zod";
import { FolderIcon, PlusIcon, RefreshCwIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import type { PluginManifest } from "../../../../main/plugins/schemas";
import { Anchor } from "../../../components/anchor";
import { Button } from "../../../components/button";
import {
	Card,
	CardAction,
	CardActions,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardInfo,
	CardTitle,
} from "../../../components/card";
import { Checkbox } from "../../../components/checkbox";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogInfo,
	DialogContent,
} from "../../../components/dialog";
import {
	ErrorRoot,
	ErrorContainer,
	ErrorControl,
	ErrorDescription,
	ErrorInfo,
	ErrorTitle,
} from "../../../components/error";
import * as FieldController from "../../../components/field-controller";
import * as Form from "../../../components/form-primitive";
import { IconButton } from "../../../components/icon-button";
import * as RhfForm from "../../../components/rhf-form";
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
import { Tooltip } from "../../../components/tooltip";
import * as VerticalTabs from "../../../components/vertical-tabs-primitive";
import { useModalContext } from "../../../features/modals/hooks";
import { showDialog } from "../../../features/modals/utils";
import { PluginSettingsSection } from "../../../features/plugins/components/plugin-settings-section";
import type { ActivePlugin } from "../../../features/plugins/core/plugin-manager";
import { useActivePlugin } from "../../../features/plugins/hooks/core";
import {
	useDisablePluginMutation,
	useEnablePluginMutation,
	useInstallPluginMutation,
	useUninstallPluginMutation,
} from "../../../features/plugins/hooks/queries";
import { useUpdatePluginSettingsMutation } from "../../../features/plugins/hooks/queries";
import { usePluginContextSettings } from "../../../features/plugins/hooks/use-plugin-context-settings";
import { useMainRouterClient } from "../../../lib/trpc";
import { useDeleteAllChatsMutation } from "../../chat/hooks/queries";
import { showNotification } from "../../notifications/utils";
import { usePluginList } from "../../plugins/hooks/core";
import { useGetSettingsSuspenseQuery, useUpdateSettingsMutation } from "../hooks";
import { useSettingsTabsStore } from "../stores";

const GeneralTabContent = () => {
	return (
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
	);
};

const PersonalizationTabContent = () => {
	const getSettingsQuery = useGetSettingsSuspenseQuery();
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	const form = useForm({
		values: {
			username: settings.username,
			systemPrompt: settings.systemPrompt,
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		updateSettingsMutation.mutate(data);
	});

	return (
		<FormProvider {...form}>
			<Form.Root onSubmit={handleSubmit}>
				<Form.Content>
					<Form.Section>
						<Form.SectionContent>
							<FieldController.Root
								id="username"
								name="username"
								label="Username"
								description="What would you like to be called?"
							>
								<FieldController.TextInput placeholder="Enter your name" />
							</FieldController.Root>
							<FieldController.Root
								id="system-prompt"
								name="systemPrompt"
								label="System prompt"
								description={
									<>
										This prompt is used to set the context for all chat
										completions. Learn about{" "}
										<Anchor
											href="https://handlebarsjs.com"
											target="_blank"
											tabIndex={-1}
										>
											Handlebars
										</Anchor>
										.
									</>
								}
							>
								<FieldController.Textarea />
							</FieldController.Root>
						</Form.SectionContent>
					</Form.Section>
				</Form.Content>
				<Form.Footer>
					<Form.Actions>
						<RhfForm.ResetButton>Cancel</RhfForm.ResetButton>
						<Form.SubmitButton>Save changes</Form.SubmitButton>
					</Form.Actions>
				</Form.Footer>
			</Form.Root>
		</FormProvider>
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
													title: "Transparency enabled",
													message: "Restart the app to apply changes",
												});
											} else {
												showNotification({
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
													title: "Developer mode enabled",
													message: "Restart the app to apply changes",
												});
											} else {
												showNotification({
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

const installPluginFormSchema = z.object({
	repoUrl: z.string().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, {
		message: "Please enter a valid GitHub repo URL",
	}),
});

const InstallPluginDialog = () => {
	const modalCtx = useModalContext();
	const installPluginMutation = useInstallPluginMutation();

	const form = useForm({
		resolver: zodResolver(installPluginFormSchema),
		values: {
			repoUrl: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		const repoParts = data.repoUrl.split("/");
		const repoOwner = repoParts[3]!;
		const repoName = repoParts[4]!;

		installPluginMutation.mutate(
			{
				owner: repoOwner,
				repo: repoName,
			},
			{
				onSuccess: () => {
					modalCtx.close();
				},
			}
		);
	});

	return (
		<FormProvider {...form}>
			<Dialog component="form" onSubmit={onSubmit}>
				<DialogHeader>
					<DialogInfo>
						<DialogTitle>Install plugin</DialogTitle>
						<DialogDescription>
							Enter the GitHub repository URL of the plugin you want to install.
						</DialogDescription>
					</DialogInfo>
				</DialogHeader>
				<DialogContent>
					<FieldController.Root id="repo-url" name="repoUrl">
						<FieldController.TextInput
							autoFocus
							placeholder="https://github.com/limbo-llm/plugin-ollama"
						/>
					</FieldController.Root>
				</DialogContent>
				<DialogFooter>
					<DialogActions>
						<Button onClick={modalCtx.close}>Cancel</Button>
						<Button
							type="submit"
							disabled={!form.formState.isDirty}
							isLoading={installPluginMutation.isPending}
						>
							Install
						</Button>
					</DialogActions>
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};

interface UninstallPluginDialogProps {
	plugin: {
		id: string;
		name: string;
	};
}

const UninstallPluginDialog = ({ plugin }: UninstallPluginDialogProps) => {
	const modalCtx = useModalContext();
	const uninstallPluginMutation = useUninstallPluginMutation();

	const handleUninstall = () => {
		uninstallPluginMutation.mutate(
			{
				id: plugin.id,
			},
			{
				onSuccess: () => {
					modalCtx.close();
				},
			}
		);
	};

	return (
		<Dialog>
			<DialogHeader>
				<DialogInfo>
					<DialogTitle>Uninstall {plugin.name}</DialogTitle>
				</DialogInfo>
			</DialogHeader>
			<DialogContent>
				<p>
					Are you sure you want to uninstall this plugin? The plugin and associated data
					will be deleted.
				</p>
			</DialogContent>
			<DialogFooter>
				<DialogActions>
					<Button onClick={modalCtx.close}>Cancel</Button>
					<Button isLoading={uninstallPluginMutation.isPending} onClick={handleUninstall}>
						Uninstall
					</Button>
				</DialogActions>
			</DialogFooter>
		</Dialog>
	);
};

interface PluginCardProps {
	plugin: {
		enabled: boolean;
		manifest: PluginManifest;
	};
}

const PluginCard = ({ plugin }: PluginCardProps) => {
	const enablePluginMutaton = useEnablePluginMutation();
	const disablePluginMutation = useDisablePluginMutation();

	const toggleEnabled = () => {
		if (plugin.enabled) {
			disablePluginMutation.mutate({
				id: plugin.manifest.id,
			});
		} else {
			enablePluginMutaton.mutate({
				id: plugin.manifest.id,
			});
		}
	};

	const openSettings = () => {
		const settingsTabsStore = useSettingsTabsStore.getState();

		settingsTabsStore.setActiveTab(`plugin-${plugin.manifest.id}`);
	};

	return (
		<Card
			className="plugin-card"
			data-plugin-id={plugin.manifest.id}
			data-plugin-enabled={plugin.enabled}
		>
			<CardHeader>
				<CardInfo>
					<CardTitle>{plugin.manifest.name}</CardTitle>
					<CardDescription>{plugin.manifest.description}</CardDescription>
				</CardInfo>
				<CardAction>
					<Switch checked={plugin.enabled} onCheckedChange={toggleEnabled} />
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="plugin-version">v{plugin.manifest.version}</div>
				<div className="plugin-author">By {plugin.manifest.author.name}</div>
			</CardContent>
			<CardFooter>
				<CardActions>
					<Tooltip label="Settings">
						<IconButton data-action="open-settings" onClick={openSettings}>
							<SettingsIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Reload">
						<IconButton action="reload">
							<RefreshCwIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Uninstall">
						<IconButton
							action="uninstall"
							onClick={() =>
								showDialog({
									component: () => (
										<UninstallPluginDialog
											plugin={{
												id: plugin.manifest.id,
												name: plugin.manifest.name,
											}}
										/>
									),
								})
							}
						>
							<Trash2Icon />
						</IconButton>
					</Tooltip>
				</CardActions>
			</CardFooter>
		</Card>
	);
};

const PluginsTabContent = () => {
	const plugins = usePluginList();
	const mainRouterClient = useMainRouterClient();

	const openPluginsFolder = () => {
		mainRouterClient.plugins.openFolder.mutate();
	};

	return (
		<div>
			<div>
				<div>Plugins</div>
				<div className="plugins-actions">
					<Tooltip label="Open plugins folder">
						<IconButton onClick={openPluginsFolder}>
							<FolderIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Install plugin">
						<IconButton onClick={() => showDialog({ component: InstallPluginDialog })}>
							<PlusIcon />
						</IconButton>
					</Tooltip>
				</div>
			</div>
			<div>
				<div className="plugin-list">
					{Object.values(plugins).map((plugin) => (
						<PluginCard plugin={plugin} key={plugin.manifest.id} />
					))}
				</div>
			</div>
		</div>
	);
};

interface PluginSettingsFormContainerProps {
	plugin: ActivePlugin;
}

const PluginSettingsFormContainer = ({ plugin }: PluginSettingsFormContainerProps) => {
	const updatePluginSettingsMutation = useUpdatePluginSettingsMutation();
	const settings = usePluginContextSettings(plugin.context);
	const [settingsValues, setSettingsValues] = useState({});

	const onSubmit = (values: Record<string, any>) => {
		setSettingsValues(values);

		// update the cached settings values
		for (const [key, value] of Object.entries(values)) {
			plugin.context.setCachedSettingValue(key, value);
		}

		// update the plugin settings
		updatePluginSettingsMutation.mutate({
			id: plugin.manifest.id,
			settings: values,
		});
	};

	useEffect(() => {
		const cachedSettings = plugin.context.getCachedSettingValues();

		setSettingsValues(cachedSettings);
	}, [plugin.context]);

	return (
		<PluginSettingsSection values={settingsValues} settings={settings} onSubmit={onSubmit} />
	);
};

interface PluginContentProps {
	pluginId: string;
}

const PluginTabContent = ({ pluginId }: PluginContentProps) => {
	const plugin = useActivePlugin(pluginId);

	return (
		<div className="plugin-settings-page">
			<div>
				{plugin ? (
					<PluginSettingsFormContainer plugin={plugin} />
				) : (
					<ErrorContainer>
						<ErrorRoot>
							<ErrorInfo>
								<ErrorTitle>Plugin not found</ErrorTitle>
								<ErrorDescription>
									The plugin you are trying to access is not active.
								</ErrorDescription>
							</ErrorInfo>
						</ErrorRoot>
					</ErrorContainer>
				)}
			</div>
		</div>
	);
};

export const SettingsTabs = () => {
	const settingsTabsStore = useSettingsTabsStore(
		useShallow((state) => ({
			activeTab: state.activeTab,
			setActiveTab: state.setActiveTab,
		}))
	);

	const pluginList = usePluginList();
	const enabledPlugins = pluginList.filter((plugin) => plugin.enabled);

	return (
		<VerticalTabs.Root
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
						<VerticalTabs.ListSectionItem value="plugins">
							Plugins
						</VerticalTabs.ListSectionItem>
					</VerticalTabs.ListSectionContent>
				</VerticalTabs.ListSection>
				{enabledPlugins.length > 0 && (
					<VerticalTabs.ListSection>
						<VerticalTabs.ListSectionHeader>
							<VerticalTabs.ListSectionTitle>Plugins</VerticalTabs.ListSectionTitle>
						</VerticalTabs.ListSectionHeader>
						<VerticalTabs.ListSectionContent>
							{enabledPlugins.map((plugin) => (
								<VerticalTabs.ListSectionItem
									value={`plugin-${plugin.manifest.id}`}
									key={plugin.manifest.id}
								>
									{plugin.manifest.name}
								</VerticalTabs.ListSectionItem>
							))}
						</VerticalTabs.ListSectionContent>
					</VerticalTabs.ListSection>
				)}
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
			<VerticalTabs.Content value="plugins">
				<PluginsTabContent />
			</VerticalTabs.Content>
			{enabledPlugins.map((plugin) => (
				<VerticalTabs.Content
					value={`plugin-${plugin.manifest.id}`}
					key={plugin.manifest.id}
				>
					<PluginTabContent pluginId={plugin.manifest.id} />
				</VerticalTabs.Content>
			))}
		</VerticalTabs.Root>
	);
};
