import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlugins } from "../../../features/plugins/hooks";
import { SettingsPage } from "../-components/settings-page";
import { IconButton, iconButtonVariants } from "../../../components/icon-button";
import { AlertCircleIcon, RefreshCwIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import type { PluginManifest } from "../../../../electron/plugins/schemas";
import { Tooltip } from "../../../components/tooltip";
import { Switch } from "../../../components/switch";

export const Route = createFileRoute("/settings/plugins/")({
	component: RouteComponent,
});

interface PluginCardProps {
	plugin: {
		manifest: PluginManifest;
	};
}

const PluginCard = ({ plugin }: PluginCardProps) => {
	return (
		<div className="plugin-card" data-enabled="true">
			<div className="plugin-card-header">
				<span className="plugin-card-title">{plugin.manifest.name}</span>
				<Switch />
			</div>
			<div className="plugin-card-content">
				<div className="plugin-card-info">
					<span className="plugin-card-version">v{plugin.manifest.version}</span>
					{(typeof plugin.manifest.author.name === "string" ||
						typeof plugin.manifest.author.email === "string") && (
						<span className="plugin-card-author">
							By {plugin.manifest.author.name ?? plugin.manifest.author.email}
						</span>
					)}
					<p className="plugin-card-description">{plugin.manifest.description}</p>
				</div>
				<div className="plugin-card-actions">
					<Tooltip label="Errors">
						<IconButton
							variant="ghost"
							color="secondary"
							className="plugin-card-action"
							data-action="errors"
						>
							<AlertCircleIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Settings">
						<Link
							className={iconButtonVariants({
								variant: "ghost",
								color: "secondary",
								className: "plugin-card-action",
							})}
							to="/settings/plugins/$id"
							params={{ id: plugin.manifest.id }}
							data-action="settings"
						>
							<SettingsIcon />
						</Link>
					</Tooltip>
					<Tooltip label="Reload">
						<IconButton
							className="plugin-card-action"
							variant="ghost"
							color="secondary"
							data-action="reload"
						>
							<RefreshCwIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Uninstall">
						<IconButton
							className="plugin-card-action"
							variant="ghost"
							color="secondary"
							data-action="uninstall"
						>
							<Trash2Icon />
						</IconButton>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

function RouteComponent() {
	const plugins = usePlugins();

	return (
		<SettingsPage className="settings-page--plugins">
			{plugins.map((plugin) => (
				<PluginCard plugin={plugin} key={plugin.manifest.id} />
			))}
		</SettingsPage>
	);
}
