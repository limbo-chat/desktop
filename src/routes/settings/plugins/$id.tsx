import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "../-components/settings-page";
import { PluginSettingsForm } from "../../../features/plugins/components/plugin-settings-form";
import { usePlugins } from "../../../features/plugins/hooks";

export const Route = createFileRoute("/settings/plugins/$id")({
	component: PluginSettingsPage,
});

function PluginSettingsPage() {
	const params = Route.useParams();

	const plugins = usePlugins();
	const plugin = plugins.find((p) => p.manifest.id === params.id);

	if (!plugin) {
		return <div>Plugin not found</div>;
	}

	return (
		<SettingsPage className="settings-page--plugin">
			<PluginSettingsForm
				className="flex flex-col gap-lg"
				onSubmit={console.log}
				plugin={plugin}
			/>
		</SettingsPage>
	);
}
