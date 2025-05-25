import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "../-components/settings-page";
import { PluginSettingsForm } from "../../../features/plugins/components/plugin-settings-form";
import { useActivePlugin } from "../../../features/plugins/hooks/core";
import { useUpdatePluginSettingsMutation } from "../../../features/plugins/hooks/queries";

export const Route = createFileRoute("/settings/plugins/$id")({
	component: PluginSettingsPage,
});

function PluginSettingsPage() {
	const params = Route.useParams();
	const plugin = useActivePlugin(params.id);
	const updatePluginSettingsMutation = useUpdatePluginSettingsMutation();

	if (!plugin) {
		return <div>plugin not found</div>;
	}

	return (
		<SettingsPage className="settings-page--plugin">
			<PluginSettingsForm
				plugin={plugin}
				onSubmit={(settingsValues) => {
					console.log("settingsValues", settingsValues);

					updatePluginSettingsMutation.mutate({
						id: plugin.manifest.id,
						settings: settingsValues,
					});
				}}
			/>
		</SettingsPage>
	);
}
