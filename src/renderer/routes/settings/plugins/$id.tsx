import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SettingsPage, SettingsPageContent } from "../-components/settings-page";
import {
	ErrorRoot,
	ErrorContainer,
	ErrorControl,
	ErrorDescription,
	ErrorInfo,
	ErrorTitle,
} from "../../../components/error";
import { PluginSettingsSection } from "../../../features/plugins/components/plugin-settings-section";
import type { ActivePlugin } from "../../../features/plugins/core/plugin-manager";
import { useActivePlugin } from "../../../features/plugins/hooks/core";
import { useUpdatePluginSettingsMutation } from "../../../features/plugins/hooks/queries";
import { usePluginContextSettings } from "../../../features/plugins/hooks/use-plugin-context-settings";

export const Route = createFileRoute("/settings/plugins/$id")({
	component: PluginSettingsPage,
});

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

function PluginSettingsPage() {
	const params = Route.useParams();
	const plugin = useActivePlugin(params.id);

	return (
		<SettingsPage className="plugin-settings-page">
			<SettingsPageContent>
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
							<ErrorControl>
								<Link className="button" to="/settings/plugins">
									Go back
								</Link>
							</ErrorControl>
						</ErrorRoot>
					</ErrorContainer>
				)}
			</SettingsPageContent>
		</SettingsPage>
	);
}
