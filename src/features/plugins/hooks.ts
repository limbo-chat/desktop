import { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { PluginManagerContext } from "./contexts";
import { useMainRouter, useMainRouterClient } from "../../lib/trpc";
import { PluginContext, type PluginHostBridge } from "./core/plugin-context";
import { updateChatInQueryCache } from "../chat/utils";
import { usePluginStore } from "./stores";
import type * as limbo from "limbo";

export const usePluginManager = () => {
	const pluginManager = useContext(PluginManagerContext);

	if (!pluginManager) {
		throw new Error("usePluginManager must be used within a PluginManagerProvider");
	}

	return pluginManager;
};

export function usePluginBridgeFactory() {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const pluginManager = usePluginManager();

	return useCallback((): PluginHostBridge => {
		return {
			getLLM: (llmId: string) => pluginManager.getLLM(llmId),
			showNotification: (notification) => {
				// TODO, actually show the notification
				console.log("showNotification called from plugin");
			},
			renameChat: async (chatId: string, newName: string) => {
				const updatedChat = await mainRouterClient.chats.rename.mutate({
					id: chatId,
					name: newName,
				});

				updateChatInQueryCache(queryClient, mainRouter, updatedChat);
			},
			getChat: async (chatId: string) => {
				return await mainRouterClient.chats.get.query({ id: chatId });
			},
			getChatMessages: async (opts) => {
				return await mainRouterClient.chats.messages.getMany.query(opts);
			},
		};
	}, []);
}

export const usePluginLoader = () => {
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const pluginManager = usePluginManager();
	const getPluginIdsQuery = useSuspenseQuery(mainRouter.plugins.getPluginIds.queryOptions());
	const pluginBridgeFactory = usePluginBridgeFactory();

	const loadPlugin = useCallback(async (pluginId: string) => {
		const pluginStore = usePluginStore.getState();

		const manifest = await mainRouterClient.plugins.getManifest.query({
			id: pluginId,
		});

		const data = await mainRouterClient.plugins.getData.query({
			id: pluginId,
		});

		pluginStore.addPlugin(manifest.id, {
			manifest,
			enabled: data.enabled,
		});

		if (!data.enabled) {
			return;
		}

		const js = await mainRouterClient.plugins.getJs.query({
			id: pluginId,
		});

		const pluginContext = new PluginContext({
			manifest,
			hostBridge: pluginBridgeFactory(),
		});

		// load the settings from disk into the plugin context
		for (const [key, val] of Object.entries(data.settings)) {
			pluginContext.setCachedSetting(key, val);
		}

		pluginContext.loadModule(js, manifest.id);

		await pluginManager.addPlugin(pluginId, pluginContext);
	}, []);

	const loadPlugins = useCallback(async () => {
		// load all of the plugins in parallel
		await Promise.allSettled(getPluginIdsQuery.data.map((pluginId) => loadPlugin(pluginId)));

		// activate all plugin contexts sequentially
		// should this be parallel too?
		await pluginManager.activatePlugins();
	}, []);

	useEffect(() => {
		loadPlugins();
	}, []);
};

export const usePluginHotReloader = () => {
	const mainRouterClient = useMainRouterClient();
	const pluginManager = usePluginManager();
	const pluginBridgeFactory = usePluginBridgeFactory();

	useEffect(() => {
		const handleReloadManifest = async (_: any, pluginId: string) => {
			const pluginStore = usePluginStore.getState();
			const pluginData = pluginStore.getPlugin(pluginId);

			if (!pluginData) {
				return;
			}

			const newManifest = await mainRouterClient.plugins.getManifest.query({
				id: pluginId,
			});

			pluginStore.updatePlugin(pluginId, {
				...pluginData,
				manifest: newManifest,
			});
		};

		const handleReloadJs = async (_: any, pluginId: string) => {
			const oldPluginContext = pluginManager.getPlugin(pluginId);

			// plugins that have never been loaded cannot be hot reloaded
			if (!oldPluginContext) {
				return;
			}

			// remove the plugin from the manager (it will be replaced)
			pluginManager.removePlugin(pluginId);

			// deactivate the plugin context
			await oldPluginContext.deactivate();

			// destroy the plugin context
			await oldPluginContext.destroy();

			// fetch the js content for the plugin
			const js = await mainRouterClient.plugins.getJs.query({
				id: pluginId,
			});

			const newPluginContext = new PluginContext({
				manifest: oldPluginContext.manifest,
				hostBridge: pluginBridgeFactory(),
			});

			newPluginContext.loadModule(js, pluginId);

			// add the new plugin context to the manager
			pluginManager.addPlugin(pluginId, newPluginContext);

			// activate the new plugin context
			await newPluginContext.activate();

			console.info(
				`%c hot reloaded plugin: "${pluginId}"`,
				"color: cornflowerblue; font-weight: bold;"
			);
		};

		window.ipcRenderer.on("plugin:reload-manifest", handleReloadManifest);
		window.ipcRenderer.on("plugin:reload-js", handleReloadJs);

		return () => {
			window.ipcRenderer.off("plugin:reload-manifest", handleReloadManifest);
			window.ipcRenderer.off("plugin:reload-js", handleReloadJs);
		};
	}, []);
};

export const usePlugins = () => {
	const pluginManager = usePluginManager();
	const [plugins, setPlugins] = useState<PluginContext[]>(() => pluginManager.getPlugins());

	useEffect(() => {
		// also get the plugins on mount (they may have been empty when the component first rendered)
		setPlugins([...pluginManager.getPlugins()]);

		const handler = () => {
			setPlugins([...pluginManager.getPlugins()]);
		};

		pluginManager.events.on("plugin:added", handler);
		pluginManager.events.on("plugin:removed", handler);
		pluginManager.events.on("plugin:state-changed", handler);

		return () => {
			pluginManager.events.off("plugin:added", handler);
			pluginManager.events.off("plugin:removed", handler);
			pluginManager.events.off("plugin:state-changed", handler);
		};
	}, []);

	return plugins;
};

export const useRegisteredLLMs = () => {
	const pluginManager = usePluginManager();

	const getLLMs = useCallback(() => {
		const plugins = pluginManager.getPlugins();

		return plugins.flatMap((plugin) => {
			const pluginLLMs = plugin.getRegisteredLLMs();

			return pluginLLMs.map((llm) => {
				return {
					plugin,
					llm,
				};
			});
		});
	}, [pluginManager]);

	const [llms, setLLMs] = useState(() => getLLMs());

	useEffect(() => {
		const handleUpdate = () => {
			setLLMs(getLLMs());
		};

		pluginManager.events.on("plugin:added", handleUpdate);
		pluginManager.events.on("plugin:removed", handleUpdate);
		pluginManager.events.on("plugin:state-changed", handleUpdate);

		return () => {
			pluginManager.events.off("plugin:added", handleUpdate);
			pluginManager.events.off("plugin:removed", handleUpdate);
			pluginManager.events.off("plugin:state-changed", handleUpdate);
		};
	}, []);

	return llms;
};

export const useInstallPluginMutation = () => {
	const mainRouter = useMainRouter();

	return useMutation(
		mainRouter.plugins.install.mutationOptions({
			onSuccess: (manifest) => {
				const pluginStore = usePluginStore.getState();

				pluginStore.addPlugin(manifest.id, {
					manifest,
					enabled: false, // newly installed plugins are disabled by default
				});

				// TODO, show toast
			},
			onError: () => {
				// TODO, show toast
			},
		})
	);
};

export const useUninstallPluginMutation = () => {
	const mainRouter = useMainRouter();
	const pluginManager = usePluginManager();

	return useMutation(
		mainRouter.plugins.uninstall.mutationOptions({
			onSuccess: async (_, variables) => {
				const pluginStore = usePluginStore.getState();

				pluginStore.removePlugin(variables.id);

				const pluginContext = pluginManager.getPlugin(variables.id);

				if (!pluginContext) {
					return;
				}

				await pluginManager.removePlugin(variables.id);
				await pluginContext.deactivate();
				await pluginContext.destroy();
			},
			onError: () => {
				// TODO, show toast
				console.error("failed to uninstall plugin");
			},
		})
	);
};
