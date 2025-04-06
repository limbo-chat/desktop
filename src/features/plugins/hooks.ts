import { useCallback, useContext, useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PluginManagerContext } from "./contexts";
import { useMainRouter } from "../../lib/trpc";
import { Plugin } from "./core/plugin";
import type { MainRouterOutputs } from "../../../electron/router";
import { usePluginElementStore } from "./stores";

export const usePluginManager = () => {
	const pluginManager = useContext(PluginManagerContext);

	if (!pluginManager) {
		throw new Error("usePluginManager must be used within a PluginManagerProvider");
	}

	return pluginManager;
};

export const usePluginBridgeFactory = () => {
	// we don't need to read any state, just access the store methods
	const pluginElementsStore = usePluginElementStore.getState();

	return useCallback((plugin: Plugin) => {
		plugin.events.on("activate", () => {
			// noop for now
		});

		plugin.events.on("deactivate", () => {
			pluginElementsStore.removePluginElements(plugin.manifest.id);
		});

		plugin.events.on("notification", (notification) => {
			console.log("showing notification in react!", notification);
		});

		plugin.events.on("registeredSetting", (setting) => {
			pluginElementsStore.addSetting({
				pluginId: plugin.manifest.id,
				...setting,
			});
		});

		plugin.events.on("unregisteredSetting", (settingId) => {
			pluginElementsStore.removeSetting(plugin.manifest.id, settingId);
		});

		plugin.events.on("registeredLLM", (llm) => {
			pluginElementsStore.addLLM({
				pluginId: plugin.manifest.id,
				...llm,
			});
		});

		plugin.events.on("unregisteredLLM", (llmId) => {
			pluginElementsStore.removeLLM(plugin.manifest.id, llmId);
		});

		plugin.events.on("registeredToolbarToggle", (toolbarToggle) => {
			pluginElementsStore.addToolbarToggle({
				pluginId: plugin.manifest.id,
				...toolbarToggle,
			});
		});

		plugin.events.on("unregisteredToolbarToggle", (toolbarToggleId) => {
			pluginElementsStore.removeToolbarToggle(plugin.manifest.id, toolbarToggleId);
		});
	}, []);
};

export const useInitialPluginLoader = () => {
	const mainRouter = useMainRouter();
	const getPluginsQuery = useSuspenseQuery(mainRouter.plugins.getPlugins.queryOptions());
	const pluginManager = usePluginManager();
	const hasLoadedInitialPlugins = useRef(false);
	const plugins = getPluginsQuery.data;
	const subscribePlugin = usePluginBridgeFactory();

	const loadPlugins = useCallback(async (plugins: MainRouterOutputs["plugins"]["getPlugins"]) => {
		for (const pluginData of plugins) {
			try {
				const plugin = new Plugin(pluginData);

				subscribePlugin(plugin);

				await plugin.loadModule();

				pluginManager.addPlugin(plugin);
			} catch {
				console.log("failed to load plugin");
				// noop for now, will need to indicate errors
			}
		}

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
	return usePluginElementStore((state) => state.llms);
};

export const useToolbarToggleElements = () => {
	return usePluginElementStore((state) => state.toolbarToggles);
};
