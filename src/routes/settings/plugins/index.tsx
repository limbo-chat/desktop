import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlugins } from "../../../features/plugins/hooks";
import { SettingsPage } from "../-components/settings-page";
import { IconButton, iconButtonVariants } from "../../../components/icon-button";
import { AlertCircleIcon, RefreshCwIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { Tooltip } from "../../../components/tooltip";
import { Switch } from "../../../components/switch";
import {
	DialogCloseButton,
	DialogCloseTrigger,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	type DialogRootProps,
} from "../../../components/dialog";
import { Button } from "../../../components/button";
import { useMutation } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import { useState } from "react";

export const Route = createFileRoute("/settings/plugins/")({
	component: RouteComponent,
});

interface UninstallPluginDialogProps {
	plugin: {
		id: string;
		name: string;
	};
	onUninstallComplete: () => void;
	dialogProps: DialogRootProps;
}

const UninstallPluginDialog = ({
	plugin,
	onUninstallComplete,
	dialogProps,
}: UninstallPluginDialogProps) => {
	const mainRouter = useMainRouter();
	const uninstallPluginMutation = useMutation(mainRouter.plugins.uninstall.mutationOptions());

	const handleUninstall = () => {
		uninstallPluginMutation.mutate(
			{
				id: plugin.id,
			},
			{
				onSuccess: () => {
					onUninstallComplete();

					// TODO remove plugin from state
				},
				onError: () => {
					// TODO show error toast
				},
			}
		);
	};

	return (
		<DialogRoot {...dialogProps}>
			<DialogContent>
				<DialogHeader>
					<DialogCloseButton />
					<DialogTitle>Uninstall {plugin.name}</DialogTitle>
					<DialogDescription>
						Are you sure you want to uninstall this plugin? The plugin and associated
						data will be deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogCloseTrigger asChild>
						<Button color="secondary">Cancel</Button>
					</DialogCloseTrigger>
					<Button isLoading={uninstallPluginMutation.isPending} onClick={handleUninstall}>
						Uninstall
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	);
};

interface PluginCardProps {
	plugin: {
		enabled: boolean;
		manifest: any;
	};
}

const PluginCard = ({ plugin }: PluginCardProps) => {
	const [isUninstallPluginDialogOpen, setIsUninstallPluginDialogOpen] = useState(false);

	const authorName = plugin.manifest.author.name ?? plugin.manifest.author.email;

	// const isCompatibleWithApiVersion = useMemo(
	// 	() => semver.satisfies(window.env.LIMBO_API_VERSION, plugin.manifest.apiVersion),
	// 	[window.env.LIMBO_API_VERSION, plugin.manifest.apiVersion]
	// );

	return (
		<>
			<UninstallPluginDialog
				plugin={{
					id: plugin.manifest.id,
					name: plugin.manifest.name,
				}}
				dialogProps={{
					open: isUninstallPluginDialogOpen,
					onOpenChange: (e) => setIsUninstallPluginDialogOpen(e.open),
				}}
				onUninstallComplete={() => setIsUninstallPluginDialogOpen(false)}
			/>
			<div
				className="plugin-card"
				data-plugin-id={plugin.manifest.id}
				data-enabled={plugin.enabled}
			>
				<div className="plugin-card-header">
					<span className="plugin-card-title">{plugin.manifest.name}</span>
					<Switch />
				</div>
				<div className="plugin-card-content">
					<div className="plugin-card-info">
						<span className="plugin-card-version">v{plugin.manifest.version}</span>
						{authorName && <span className="plugin-card-author">By {authorName}</span>}
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
								onClick={() => setIsUninstallPluginDialogOpen(true)}
							>
								<Trash2Icon />
							</IconButton>
						</Tooltip>
					</div>
				</div>
			</div>
		</>
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
