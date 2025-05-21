import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "../-components/settings-page";
import { PluginSettingsForm } from "../../../features/plugins/components/plugin-settings-form";

// TODO, get this actually working again

export const Route = createFileRoute("/settings/plugins/$id")({
	component: PluginSettingsPage,
});

function PluginSettingsPage() {
	const params = Route.useParams();

	// return (
	// 	<SettingsPage className="settings-page--plugin">
	// 		<PluginSettingsForm
	// 			className="flex flex-col gap-lg"
	// 			onSubmit={console.log}
	// 			plugin={plugin}
	// 		/>
	// 	</SettingsPage>
	// );

	return null;
}
