import { createFileRoute } from "@tanstack/react-router";
import { usePlugin } from "../../../features/plugins/hooks";
import { PluginSettingsForm } from "../../../features/plugins/components/plugin-settings-form";

export const Route = createFileRoute("/settings/plugins/$id")({
	component: PluginSettingsPage,
});

function PluginSettingsPage() {
	const params = Route.useParams();
	const plugin = usePlugin(params.id);

	if (!plugin) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<PluginSettingsForm
				className="flex flex-col gap-lg"
				onSubmit={console.log}
				plugin={plugin}
			/>
		</div>
	);
}
