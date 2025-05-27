import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircleIcon,
	FolderIcon,
	PlusIcon,
	RefreshCwIcon,
	SettingsIcon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsPage } from "../-components/settings-page";
import type { PluginManifest } from "../../../../electron/plugins/schemas";
import { Button } from "../../../components/button";
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
import { IconButton, iconButtonVariants } from "../../../components/icon-button";
import { Switch } from "../../../components/switch";
import { Tooltip } from "../../../components/tooltip";
import { TextInputFieldController } from "../../../features/forms/components";
import { usePluginList } from "../../../features/plugins/hooks/core";
import {
	useDisablePluginMutation,
	useEnablePluginMutation,
	useInstallPluginMutation,
	useUninstallPluginMutation,
} from "../../../features/plugins/hooks/queries";
import { useMainRouterClient } from "../../../lib/trpc";

export const Route = createFileRoute("/settings/plugins/")({
	component: PluginsSettingsPage,
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
	const uninstallPluginMutation = useUninstallPluginMutation();

	const handleUninstall = () => {
		uninstallPluginMutation.mutate(
			{
				id: plugin.id,
			},
			{
				onSuccess: () => {
					onUninstallComplete();
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
					<Button
						color="destructive"
						isLoading={uninstallPluginMutation.isPending}
						onClick={handleUninstall}
					>
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
		manifest: PluginManifest;
	};
}

const PluginCard = ({ plugin }: PluginCardProps) => {
	const enablePluginMutaton = useEnablePluginMutation();
	const disablePluginMutation = useDisablePluginMutation();
	const [isUninstallPluginDialogOpen, setIsUninstallPluginDialogOpen] = useState(false);
	const authorName = plugin.manifest.author.name ?? plugin.manifest.author.email;

	const toggleEnabled = () => {
		if (plugin.enabled) {
			disablePluginMutation.mutate({
				id: plugin.manifest.id,
			});
		} else {
			enablePluginMutaton.mutate({
				id: plugin.manifest.id,
			});
		}
	};

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
					<Switch checked={plugin.enabled} onCheckedChange={toggleEnabled} />
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
							>
								<RefreshCwIcon />
							</IconButton>
						</Tooltip>
						<Tooltip label="Uninstall">
							<IconButton
								className="plugin-card-action"
								variant="ghost"
								color="destructive"
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

interface InstallPluginDialogProps {
	onInstallComplete: () => void;
	dialogProps: DialogRootProps;
}

const installPluginFormSchema = z.object({
	repoUrl: z.string().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, {
		message: "Please enter a valid GitHub repo URL",
	}),
});

const InstallPluginDialog = ({ onInstallComplete, dialogProps }: InstallPluginDialogProps) => {
	const installPluginMutation = useInstallPluginMutation();

	const form = useForm({
		resolver: zodResolver(installPluginFormSchema),
		values: {
			repoUrl: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		const repoParts = data.repoUrl.split("/");
		const repoOwner = repoParts[3];
		const repoName = repoParts[4];

		installPluginMutation.mutate(
			{
				owner: repoOwner,
				repo: repoName,
			},
			{
				onSuccess: () => {
					form.reset();

					onInstallComplete();
				},
			}
		);
	});

	return (
		<DialogRoot {...dialogProps}>
			<DialogContent>
				<DialogCloseButton />
				<DialogHeader>
					<DialogTitle>Install plugin</DialogTitle>
					<DialogDescription>
						Enter the GitHub repository URL of the plugin you want to install.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={onSubmit}>
					<TextInputFieldController
						name="repoUrl"
						control={form.control}
						textFieldProps={{
							textInputProps: {
								placeholder: "https://github.com/limbo-llm/plugin-ollama",
							},
						}}
					/>
					<DialogFooter>
						<DialogCloseTrigger asChild>
							<Button variant="ghost" color="secondary">
								Cancel
							</Button>
						</DialogCloseTrigger>
						<Button
							type="submit"
							color="primary"
							disabled={!form.formState.isDirty}
							isLoading={installPluginMutation.isPending}
						>
							Install
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</DialogRoot>
	);
};

function PluginsSettingsPage() {
	const plugins = usePluginList();
	const mainRouterClient = useMainRouterClient();
	const [isInstallPluginDialogOpen, setIsInstallPluginDialogOpen] = useState(false);

	const openPluginsFolder = () => {
		mainRouterClient.plugins.openFolder.mutate();
	};

	return (
		<>
			<InstallPluginDialog
				onInstallComplete={() => setIsInstallPluginDialogOpen(false)}
				dialogProps={{
					open: isInstallPluginDialogOpen,
					onOpenChange: (e) => setIsInstallPluginDialogOpen(e.open),
				}}
			/>
			<SettingsPage className="settings-page--plugins">
				<div className="plugins-page-header">
					<h1 className="plugins-page-title">Plugins</h1>
					<div className="plugins-page-actions">
						<Tooltip label="Open plugins folder">
							<IconButton color="secondary" onClick={openPluginsFolder}>
								<FolderIcon />
							</IconButton>
						</Tooltip>
						<Tooltip label="Install plugin">
							<IconButton onClick={() => setIsInstallPluginDialogOpen(true)}>
								<PlusIcon />
							</IconButton>
						</Tooltip>
					</div>
				</div>
				<div className="plugin-list">
					{Object.values(plugins).map((plugin) => (
						<PluginCard plugin={plugin} key={plugin.manifest.id} />
					))}
				</div>
			</SettingsPage>
		</>
	);
}
