import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "es-toolkit";
import { Button } from "../../../../components/button";
import {
	ErrorState,
	ErrorStateActions,
	ErrorStateDescription,
	ErrorStateTitle,
} from "../../../../components/error-state";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import type { ViewComponentProps } from "../../../view-stack/types";
import type { SettingEntry } from "../../core/plugin-backend";
import type { ActivePlugin } from "../../core/plugin-manager";
import { useActivePlugin, usePluginBackend } from "../../hooks/core";
import { usePluginContextSettings } from "../../hooks/use-plugin-context-settings";
import { PluginSettingsSection } from "../plugin-settings-section";

interface PluginSettingsFormContainerProps {
	plugin: ActivePlugin;
}

const PluginSettingsFormContainer = ({ plugin }: PluginSettingsFormContainerProps) => {
	const pluginBackend = usePluginBackend();
	const settings = usePluginContextSettings(plugin.context);
	const pendingSettingUpdates = useRef<Map<string, any>>(new Map());
	const [settingsValues, setSettingsValues] = useState({});

	const updatePendingSettings = useCallback(
		debounce(async () => {
			const settingEntries: SettingEntry[] = [];

			for (const [settingId, value] of pendingSettingUpdates.current) {
				settingEntries.push({
					id: settingId,
					value,
				});
			}

			pendingSettingUpdates.current.clear();

			await pluginBackend.updatePluginSettings(plugin.manifest.id, settingEntries);
		}, 500),
		[plugin]
	);

	const handleSettingChange = useCallback(
		(id: string, value: any) => {
			setSettingsValues((prev) => ({
				...prev,
				[id]: value,
			}));

			plugin.context.setCachedSettingValue(id, value);

			pendingSettingUpdates.current.set(id, value);

			updatePendingSettings();
		},
		[plugin, updatePendingSettings]
	);

	useEffect(() => {
		const cachedSettings = plugin.context.getCachedSettingValues();

		setSettingsValues(cachedSettings);

		return () => {
			updatePendingSettings.flush();
		};
	}, [plugin]);

	return (
		<PluginSettingsSection
			settings={settings}
			settingValues={settingsValues}
			onSettingChange={handleSettingChange}
		/>
	);
};

export interface PluginSettingsViewData {
	pluginId: string;
}

export const PluginSettingsView = ({ view }: ViewComponentProps<PluginSettingsViewData>) => {
	const viewStack = useViewStackContext();
	const plugin = useActivePlugin(view.data.pluginId);

	if (!plugin) {
		return (
			<View.Root>
				<View.Header>
					<View.HeaderStart>
						<View.BackButton type="button" />
						<View.TitleProps>Plugin not found</View.TitleProps>
					</View.HeaderStart>
				</View.Header>
				<View.Content>
					<ErrorState>
						<ErrorStateTitle>Plugin not found</ErrorStateTitle>
						<ErrorStateDescription>
							The plugin you are trying to access is not active.
						</ErrorStateDescription>
						<ErrorStateActions>
							<Button
								onClick={() => {
									viewStack.pop();
								}}
							>
								Go back
							</Button>
						</ErrorStateActions>
					</ErrorState>
				</View.Content>
			</View.Root>
		);
	}

	return (
		<View.Root>
			<View.Header>
				<View.HeaderStart>
					<View.BackButton type="button" />
					<View.TitleProps>{plugin.manifest.name} Settings</View.TitleProps>
				</View.HeaderStart>
			</View.Header>
			<View.Content>
				<PluginSettingsFormContainer plugin={plugin} />
			</View.Content>
		</View.Root>
	);
};
