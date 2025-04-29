import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { PluginManagerContext } from "./contexts";
import { useMainRouter } from "../../lib/trpc";
import { PluginContext } from "./core/plugin-context";

export const usePluginManager = () => {
	const pluginManager = useContext(PluginManagerContext);

	if (!pluginManager) {
		throw new Error("usePluginManager must be used within a PluginManagerProvider");
	}

	return pluginManager;
};

export const usePluginLoader = () => {
	const mainRouter = useMainRouter();
	const getPluginsQuery = useSuspenseQuery(mainRouter.plugins.getPluginIds.queryOptions());
	const pluginManager = usePluginManager();

	const loadPlugins = useCallback(async () => {
		for (const pluginId of getPluginsQuery.data) {
			await pluginManager.loadPlugin(pluginId);
		}

		// activate all plugins sequentially
		await pluginManager.activatePlugins();
	}, []);

	useEffect(() => {
		loadPlugins();
	}, []);
};

export const usePluginHotReloader = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const handler = async (_event: any, pluginId: string) => {
			const plugin = pluginManager.getPlugin(pluginId);

			await pluginManager.reloadPlugin(pluginId);

			console.info(
				`%c hot reloaded plugin: "${plugin.manifest.id}"`,
				"color: cornflowerblue; font-weight: bold;"
			);
		};

		window.ipcRenderer.on("plugin-reload", handler);

		return () => {
			window.ipcRenderer.off("plugin-reload", handler);
		};
	}, []);
};

export const usePlugins = () => {
	const pluginManager = usePluginManager();
	const [plugins, setPlugins] = useState<PluginContext[]>(() => pluginManager.getPlugins());

	useEffect(() => {
		// also get the plugins on mount (they may have been empty when the component mounted)
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

export const usePlugin = (pluginId: string) => {
	const plugins = usePlugins();

	return useMemo(() => {
		return plugins.find((plugin) => plugin.manifest.id === pluginId);
	}, [plugins, pluginId]);
};
