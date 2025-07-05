import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FolderIcon, PlusIcon, RefreshCwIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import {
	SettingsPage,
	SettingsPageContent,
	SettingsPageHeader,
	SettingsPageTitle,
} from "../-components/settings-page";
import type { PluginManifest } from "../../../../main/plugins/schemas";
import { Button } from "../../../components/button";
import {
	Card,
	CardAction,
	CardActions,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardInfo,
	CardTitle,
} from "../../../components/card";
import {
	DialogCloseButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogInfo,
	DialogContent,
} from "../../../components/dialog";
import * as FieldController from "../../../components/field-controller";
import { IconButton } from "../../../components/icon-button";
import { Link } from "../../../components/link";
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
		const repoOwner = repoParts[3]!;
		const repoName = repoParts[4]!;

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
		<FormProvider {...form}>
			<Dialog component="form" onSubmit={onSubmit}>
				<DialogHeader>
					<DialogInfo>
						<DialogTitle>Install plugin</DialogTitle>
						<DialogDescription>
							Enter the GitHub repository URL of the plugin you want to install.
						</DialogDescription>
					</DialogInfo>
					<DialogCloseButton />
				</DialogHeader>
				<DialogContent>
					<FieldController.Root id="repo-url" name="repoUrl">
						<FieldController.TextInput
							autoFocus
							placeholder="https://github.com/limbo-llm/plugin-ollama"
						/>
					</FieldController.Root>
				</DialogContent>
				<DialogFooter>
					<DialogActions>
						<Button onClick={modalCtx.close}>Cancel</Button>
						<Button
							type="submit"
							disabled={!form.formState.isDirty}
							isLoading={installPluginMutation.isPending}
						>
							Install
						</Button>
					</DialogActions>
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};

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
				<DialogInfo>
					<DialogTitle>Uninstall {plugin.name}</DialogTitle>
				</DialogInfo>
				<DialogCloseButton />
			</DialogHeader>
			<DialogContent>
				<p>
					Are you sure you want to uninstall this plugin? The plugin and associated data
					will be deleted.
				</p>
			</DialogContent>
			<DialogFooter>
				<DialogActions>
					<Button onClick={modalCtx.close}>Cancel</Button>
					<Button isLoading={uninstallPluginMutation.isPending} onClick={handleUninstall}>
						Uninstall
					</Button>
				</DialogActions>
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
		<Card
			className="plugin-card"
			data-plugin-id={plugin.manifest.id}
			data-plugin-enabled={plugin.enabled}
		>
			<CardHeader>
				<CardInfo>
					<CardTitle>{plugin.manifest.name}</CardTitle>
					<CardDescription>{plugin.manifest.description}</CardDescription>
				</CardInfo>
				<CardAction>
					<Switch checked={plugin.enabled} onCheckedChange={toggleEnabled} />
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="plugin-version">v{plugin.manifest.version}</div>
				<div className="plugin-author">By {plugin.manifest.author.name}</div>
			</CardContent>
			<CardFooter>
				<CardActions>
					<Tooltip label="Settings">
						<Link
							className="icon-button"
							to="/settings/plugins/$id"
							params={{ id: plugin.manifest.id }}
							data-action="open-settings"
						>
							<SettingsIcon />
						</Link>
					</Tooltip>
					<Tooltip label="Reload">
						<IconButton action="reload">
							<RefreshCwIcon />
						</IconButton>
					</Tooltip>
					<Tooltip label="Uninstall">
						<IconButton
							action="uninstall"
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
				</CardActions>
			</CardFooter>
		</Card>
	);
};

const installPluginFormSchema = z.object({
	repoUrl: z.string().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, {
		message: "Please enter a valid GitHub repo URL",
	}),
});

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
