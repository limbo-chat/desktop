import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import type { PluginManifest } from "../../../../../main/plugins/schemas";
import { AppIcon } from "../../../../components/app-icon";
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
} from "../../../../components/card";
import { EmptyState, EmptyStateTitle } from "../../../../components/empty-state";
import { IconButton } from "../../../../components/icon-button";
import { SearchInput } from "../../../../components/search-input";
import { Switch } from "../../../../components/switch";
import { Tooltip } from "../../../../components/tooltip";
import { useMainRouterClient } from "../../../../lib/trpc";
import { showModal } from "../../../modals/utils";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import { usePluginList } from "../../hooks/core";
import { useDisablePluginMutation, useEnablePluginMutation } from "../../hooks/queries";
import { InstallPluginDialog } from "../install-plugin-dialog";
import { UninstallPluginDialog } from "../uninstall-plugin-dialog";

interface PluginCardProps {
	plugin: {
		enabled: boolean;
		manifest: PluginManifest;
	};
}

const PluginCard = ({ plugin }: PluginCardProps) => {
	const viewStack = useViewStackContext();
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

	const openSettings = () => {
		viewStack.push({
			id: "plugin-settings",
			data: {
				pluginId: plugin.manifest.id,
			},
		});
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
					{plugin.enabled && (
						<Tooltip label="Settings">
							<IconButton data-action="open-settings" onClick={openSettings}>
								<AppIcon icon="settings" />
							</IconButton>
						</Tooltip>
					)}
					<Tooltip label="Uninstall">
						<IconButton
							action="uninstall"
							onClick={() =>
								showModal({
									id: "uninstall-plugin",
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
							<AppIcon icon="delete" />
						</IconButton>
					</Tooltip>
				</CardActions>
			</CardFooter>
		</Card>
	);
};

export const PluginsView = () => {
	const mainRouterClient = useMainRouterClient();
	const plugins = usePluginList();
	const [search, setSearch] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	const openPluginsFolder = () => {
		mainRouterClient.plugins.openFolder.mutate();
	};

	const filteredPlugins = useMemo(() => {
		if (!search) {
			return plugins;
		}

		const fuse = new Fuse(plugins, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["manifest.id", "manifest.name", "manifest.description"],
		});

		return fuse.search(search).map((item) => item.item);
	}, [plugins, search]);

	useEffect(() => {
		// this seems to fix the issue of the input not focusing on mount
		// not sure why I have to do this, may be due to being rendered inside radix tabs
		requestAnimationFrame(() => {
			if (searchInputRef.current) {
				searchInputRef.current.focus();
			}
		});
	}, []);

	return (
		<View.Root>
			<View.Header>
				<View.HeaderStart>
					<SearchInput
						placeholder="Search plugins..."
						value={search}
						onChange={setSearch}
						ref={searchInputRef}
					/>
				</View.HeaderStart>
				<View.HeaderActions>
					<Tooltip label="Open plugins folder">
						<IconButton onClick={openPluginsFolder}>
							<AppIcon icon="folder" />
						</IconButton>
					</Tooltip>
					<Tooltip label="Install plugin">
						<IconButton
							onClick={() =>
								showModal({ id: "install-plugin", component: InstallPluginDialog })
							}
						>
							<AppIcon icon="download" />
						</IconButton>
					</Tooltip>
				</View.HeaderActions>
			</View.Header>
			<View.Content>
				{filteredPlugins.length === 0 && (
					<EmptyState>
						<EmptyStateTitle>No plugins found</EmptyStateTitle>
					</EmptyState>
				)}
				{filteredPlugins.length > 0 && (
					<div className="plugin-list">
						{filteredPlugins.map((plugin) => (
							<PluginCard plugin={plugin} key={plugin.manifest.id} />
						))}
					</div>
				)}
			</View.Content>
		</View.Root>
	);
};
