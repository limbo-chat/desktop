import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Text } from "../../../components/text";
import { usePlugins } from "../../../features/plugins/hooks";

export const Route = createFileRoute("/settings/plugins/")({
	component: RouteComponent,
});

function RouteComponent() {
	const plugins = usePlugins();

	return (
		<div>
			<div>
				<Text size="lg">Installed plugins</Text>
			</div>
			<div className="flex flex-col gap-sm">
				{plugins.map((plugin) => (
					<div key={plugin.manifest.id}>
						<Text>{plugin.manifest.name}</Text>
						<Text size="sm">Version {plugin.manifest.version}</Text>
						<Text size="sm">By {plugin.manifest.author.name}</Text>
						<Text size="sm">{plugin.manifest.description}</Text>
					</div>
				))}
			</div>
		</div>
	);
}
