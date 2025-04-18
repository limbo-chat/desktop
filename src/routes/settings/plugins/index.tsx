import { createFileRoute } from "@tanstack/react-router";
import { usePlugins } from "../../../features/plugins/hooks";
import { SettingsPage } from "../-components/settings-page";

export const Route = createFileRoute("/settings/plugins/")({
	component: RouteComponent,
});

function RouteComponent() {
	const plugins = usePlugins();

	return (
		<SettingsPage className="settings-page--plugins">
			<div>
				<p>Installed plugins</p>
			</div>
			<div className="flex flex-col gap-sm">
				{plugins.map((plugin) => (
					<div key={plugin.manifest.id}>
						<p>{plugin.manifest.name}</p>
						<p>Version {plugin.manifest.version}</p>
						<p>By {plugin.manifest.author.name}</p>
						<p>{plugin.manifest.description}</p>
					</div>
				))}
			</div>
		</SettingsPage>
	);
}
