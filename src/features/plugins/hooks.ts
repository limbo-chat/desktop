import { useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { PluginManagerContext } from "./contexts";
import { useMainRouter, useMainRouterClient } from "../../lib/trpc";
import { Plugin } from "./core/plugin";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { MainRouterOutputs } from "../../../electron/router";

export const usePluginManager = () => {
	const pluginManager = useContext(PluginManagerContext);

	if (!pluginManager) {
		throw new Error("usePluginManager must be used within a PluginManagerProvider");
	}

	return pluginManager;
};

export const usePluginLoader = () => {
	const mainRouter = useMainRouter();
	const getPluginsQuery = useSuspenseQuery(mainRouter.plugins.getPlugins.queryOptions());
	const pluginManager = usePluginManager();

	const loadPlugin = useCallback((pluginData: MainRouterOutputs["plugins"]["getPlugins"][0]) => {
		const plugin = new Plugin({
			js: pluginData.js,
			manifest: pluginData.manifest,
		});

		// add the settings to the cache
		for (const [key, val] of Object.entries(pluginData.data.settings)) {
			plugin.setCachedSetting(key, val);
		}

		try {
			plugin.loadModule();
		} catch {
			// todo, show notification
			console.error(`failed to load plugin "${plugin.manifest.id}"`);
		}

		pluginManager.addPlugin(pluginData.manifest.id, plugin);
	}, []);

	const loadPlugins = useCallback(async () => {
		for (const pluginData of getPluginsQuery.data) {
			loadPlugin(pluginData);
		}

		// activate all plugins at the same time
		await pluginManager.activatePlugins();
	}, []);

	useEffect(() => {
		loadPlugins();
	}, []);
};

export const usePluginHotReloader = () => {
	const mainRouterClient = useMainRouterClient();
	const pluginManager = usePluginManager();

	useEffect(() => {
		const handler = async (_event: any, pluginId: string) => {
			let newPluginData;

			try {
				newPluginData = await mainRouterClient.plugins.getPlugin.query({
					id: pluginId,
				});
			} catch {
				// noop

				return;
			}

			const plugin = pluginManager.getPlugin(pluginId);

			if (!plugin) {
				return;
			}

			// deactivate the old plugin before reloading
			await plugin.deactivate();

			const newPlugin = new Plugin({
				manifest: newPluginData.manifest,
				js: newPluginData.js,
			});

			newPlugin.loadModule();

			// remove the old plugin
			pluginManager.removePlugin(pluginId);

			// aadd the new plugin
			pluginManager.addPlugin(newPlugin.manifest.id, newPlugin);

			console.info(
				`%c hot reloaded plugin: "${newPlugin.manifest.id}"`,
				"color: cornflowerblue; font-weight: bold;"
			);

			// activate the new plugin
			await newPlugin.activate();
		};

		window.ipcRenderer.on("plugin-reload", handler);

		return () => {
			window.ipcRenderer.off("plugin-reload", handler);
		};
	}, []);
};

export const usePlugins = () => {
	const pluginManager = usePluginManager();
	const [plugins, setPlugins] = useState<Plugin[]>(() => pluginManager.getPlugins());

	useEffect(() => {
		// also get the plugins on mount
		setPlugins([...pluginManager.getPlugins()]);

		const handler = () => {
			setPlugins([...pluginManager.getPlugins()]);
		};

		pluginManager.events.on("pluginAdded", handler);
		pluginManager.events.on("pluginRemoved", handler);

		return () => {
			pluginManager.events.removeListener("pluginAdded", handler);
			pluginManager.events.removeListener("pluginRemoved", handler);
		};
	}, []);

	return plugins;
};

export const usePlugin = (pluginId: string) => {
	const plugins = usePlugins();

	return useMemo(() => {
		return plugins.find((plugin) => plugin.manifest.id === pluginId);
	}, [plugins, pluginId]);
};

export const usePluginRegisteredSettings = (plugin: Plugin) => {
	return useSyncExternalStore(
		(onChange) => {
			const handler = () => {
				onChange();
			};

			plugin.events.on("registeredSetting", handler);
			plugin.events.on("unregisteredSetting", handler);

			return () => {
				plugin.events.removeListener("registeredSetting", handler);
				plugin.events.removeListener("unregisteredSetting", handler);
			};
		},
		() => plugin.getRegisteredSettings()
	);
};
