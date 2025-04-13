import { createFileRoute } from "@tanstack/react-router";
import { usePlugins } from "../../../features/plugins/hooks";

export const Route = createFileRoute("/settings/plugins/")({
	component: RouteComponent,
});

function RouteComponent() {
	const plugins = usePlugins();

	return (
		<div>
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
		</div>
	);
}
