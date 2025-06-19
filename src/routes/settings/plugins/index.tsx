import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderIcon, PlusIcon, RefreshCwIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	SettingsPage,
	SettingsPageContent,
	SettingsPageHeader,
	SettingsPageTitle,
} from "../-components/settings-page";
import type { PluginManifest } from "../../../../electron/plugins/schemas";
import { Button } from "../../../components/button";
import {
	DialogCloseButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	Dialog,
	DialogTitle,
} from "../../../components/dialog";
import { Field } from "../../../components/field";
import * as FieldPrimitive from "../../../components/field-primitive";
import { IconButton } from "../../../components/icon-button";
import { Switch } from "../../../components/switch";
import { Tooltip } from "../../../components/tooltip";
import { useModalContext } from "../../../features/modals/hooks";
import { showDialog } from "../../../features/modals/utils";
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
}

const UninstallPluginDialog = ({ plugin }: UninstallPluginDialogProps) => {
	const modalCtx = useModalContext();
	const uninstallPluginMutation = useUninstallPluginMutation();

	const handleUninstall = () => {
		uninstallPluginMutation.mutate(
			{
				id: plugin.id,
			},
			{
				onSuccess: () => {
					modalCtx.close();
				},
			}
		);
	};

	return (
		<Dialog>
			<DialogHeader>
				<DialogCloseButton />
				<DialogTitle>Uninstall {plugin.name}</DialogTitle>
				<DialogDescription>
					Are you sure you want to uninstall this plugin? The plugin and associated data
					will be deleted.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button onClick={modalCtx.close}>Cancel</Button>
				<Button isLoading={uninstallPluginMutation.isPending} onClick={handleUninstall}>
					Uninstall
				</Button>
			</DialogFooter>
		</Dialog>
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
					<Tooltip label="Settings">
						<Link
							className="icon-button plugin-card-action"
							to="/settings/plugins/$id"
							params={{ id: plugin.manifest.id }}
							data-action="open-settings"
						>
							<SettingsIcon />
						</Link>
					</Tooltip>
					<Tooltip label="Reload">
						<IconButton className="plugin-card-action" data-action="reload">
							<RefreshCwIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Uninstall">
						<IconButton
							className="plugin-card-action"
							data-action="uninstall"
							onClick={() =>
								showDialog({
									component: () => (
										<UninstallPluginDialog
											plugin={{
												id: plugin.manifest.id,
												name: plugin.manifest.name,
											}}
										/>
									),
								})
							}
						>
							<Trash2Icon />
						</IconButton>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

const installPluginFormSchema = z.object({
	repoUrl: z.string().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, {
		message: "Please enter a valid GitHub repo URL",
	}),
});

const InstallPluginDialog = () => {
	const modalCtx = useModalContext();
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
					modalCtx.close();
				},
			}
		);
	});

	return (
		<Dialog>
			<DialogHeader>
				<DialogTitle>Install plugin</DialogTitle>
				<DialogDescription>
					Enter the GitHub repository URL of the plugin you want to install.
				</DialogDescription>
			</DialogHeader>
			<form onSubmit={onSubmit}>
				<Field id="repo-url">
					<FieldPrimitive.TextInput
						placeholder="https://github.com/limbo-llm/plugin-ollama"
						{...form.register("repoUrl")}
					/>
				</Field>
				<DialogFooter>
					<Button onClick={modalCtx.close}>Cancel</Button>
					<Button
						type="submit"
						disabled={!form.formState.isDirty}
						isLoading={installPluginMutation.isPending}
					>
						Install
					</Button>
				</DialogFooter>
			</form>
		</Dialog>
	);
};

function PluginsSettingsPage() {
	const plugins = usePluginList();
	const mainRouterClient = useMainRouterClient();

	const openPluginsFolder = () => {
		mainRouterClient.plugins.openFolder.mutate();
	};

	return (
		<SettingsPage data-page="plugins">
			<SettingsPageHeader>
				<SettingsPageTitle>Plugins</SettingsPageTitle>
				<div className="plugins-actions">
					<Tooltip label="Open plugins folder">
						<IconButton onClick={openPluginsFolder}>
							<FolderIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Install plugin">
						<IconButton onClick={() => showDialog({ component: InstallPluginDialog })}>
							<PlusIcon />
						</IconButton>
					</Tooltip>
				</div>
			</SettingsPageHeader>
			<SettingsPageContent>
				<div className="plugin-list">
					{Object.values(plugins).map((plugin) => (
						<PluginCard plugin={plugin} key={plugin.manifest.id} />
					))}
				</div>
			</SettingsPageContent>
		</SettingsPage>
	);
}
