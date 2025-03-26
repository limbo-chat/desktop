import { useCallback, useContext, useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PluginManagerContext } from "./contexts";
import { useMainRouter } from "../../lib/trpc";
import { Plugin } from "./core/plugin";

export const usePluginManager = () => {
	const pluginManager = useContext(PluginManagerContext);

	if (!pluginManager) {
		throw new Error("usePluginManager must be used within a PluginManagerProvider");
	}

	return pluginManager;
};

export const useInitialPluginLoader = () => {
	const mainRouter = useMainRouter();
	const getPluginsQuery = useSuspenseQuery(mainRouter.plugins.getPlugins.queryOptions());
	const pluginManager = usePluginManager();
	const hasLoadedInitialPlugins = useRef(false);
	const plugins = getPluginsQuery.data;

	const loadPlugins = useCallback(async (plugins: any) => {
		for (const pluginData of plugins) {
			try {
				const plugin = await Plugin.create(pluginData);

				pluginManager.addPlugin(plugin);
			} catch {
				console.log("failed to load plugin");
				// noop for now, will need to indicate errors
			}
		}

		// TODO only activate plugins that are enabled

		await pluginManager.activatePlugins();
	}, []);

	useEffect(() => {
		if (!plugins || hasLoadedInitialPlugins.current) {
			return;
		}

		hasLoadedInitialPlugins.current = true;

		loadPlugins(plugins);
	}, [plugins, pluginManager]);
};

export const useLLMElements = () => {
	// return usePluginStore((state) => state.llms);
};

export const useToolbarToggleButtonElements = () => {
	// return usePluginStore((state) => state.toolbarToggleButtons);
};
