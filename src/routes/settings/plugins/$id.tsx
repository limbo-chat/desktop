import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SettingsPage } from "../-components/settings-page";
import { PluginSettingsForm } from "../../../features/plugins/components/plugin-settings-form";
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

		console.log(cachedSettings);

		setSettingsValues(cachedSettings);
	}, [plugin.context]);

	return <PluginSettingsForm values={settingsValues} settings={settings} onSubmit={onSubmit} />;
};

function PluginSettingsPage() {
	const params = Route.useParams();
	const plugin = useActivePlugin(params.id);

	return (
		<SettingsPage className="plugin-settings-page">
			{plugin ? <PluginSettingsFormContainer plugin={plugin} /> : <div>Plugin not found</div>}
		</SettingsPage>
	);
}
