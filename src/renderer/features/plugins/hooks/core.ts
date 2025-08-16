import { useContext, useEffect, useMemo, useState } from "react";
import { pluginBackendContext, pluginManagerContext, pluginSystemContext } from "../contexts";
import type { ActivePlugin } from "../core/plugin-manager";
import { usePluginStore } from "../stores";

export const usePluginManager = () => {
	const pluginManager = useContext(pluginManagerContext);

	if (!pluginManager) {
		throw new Error("usePluginManager must be used within a PluginManagerProvider");
	}

	return pluginManager;
};

export const usePluginSystem = () => {
	const pluginSystem = useContext(pluginSystemContext);

	if (!pluginSystem) {
		throw new Error("usePluginSystem must be used within a PluginSystemProvider");
	}

	return pluginSystem;
};

export const usePluginBackend = () => {
	const pluginBackend = useContext(pluginBackendContext);

	if (!pluginBackend) {
		throw new Error("usePluginBackend must be used within a PluginBackendProvider");
	}

	return pluginBackend;
};

export const usePlugins = () => {
	return usePluginStore((state) => state.plugins);
};

export const usePluginList = () => {
	const plugins = usePlugins();

	return useMemo(() => {
		return [...plugins.values()];
	}, [plugins]);
};

export const usePluginLoader = () => {
	const pluginSystem = usePluginSystem();
	const pluginBackend = usePluginBackend();

	useEffect(() => {
		const pluginStore = usePluginStore.getState();

		async function loadPlugins() {
			const allPlugins = await pluginBackend.getAllPlugins();

			for (const plugin of allPlugins) {
				pluginStore.setPlugin(plugin.manifest.id, {
					enabled: plugin.meta.enabled,
					manifest: plugin.manifest,
				});
			}

			await Promise.allSettled(
				allPlugins.map(async (plugin) => {
					try {
						await pluginSystem.loadPlugin(plugin);
					} catch {
						pluginStore.setPlugin(plugin.manifest.id, {
							manifest: plugin.manifest,
							enabled: false,
						});
					}
				})
			);
		}

		loadPlugins();
	}, []);
};

export const usePluginHotReloader = () => {
	const pluginSystem = usePluginSystem();
	const pluginBackend = usePluginBackend();

	useEffect(() => {
		const handleReloadPlugin = async (_: any, pluginId: string) => {
			const pluginStore = usePluginStore.getState();
			const freshPluginData = await pluginBackend.getPlugin(pluginId);

			pluginStore.setPlugin(pluginId, {
				manifest: freshPluginData.manifest,
				enabled: freshPluginData.meta.enabled,
			});

			await pluginSystem.unloadPlugin(pluginId);
			await pluginSystem.loadPlugin(freshPluginData);
		};

		window.ipcRenderer.on("plugin:reload", handleReloadPlugin);

		return () => {
			window.ipcRenderer.off("plugin:reload", handleReloadPlugin);
		};
	}, []);
};

export const useActivePlugin = (pluginId: string) => {
	const pluginManager = usePluginManager();
	const [plugin, setPlugin] = useState<ActivePlugin | null>(null);

	useEffect(() => {
		setPlugin(pluginManager.getPlugin(pluginId) ?? null);

		const handleChange = () => {
			setPlugin(pluginManager.getPlugin(pluginId) ?? null);
		};

		pluginManager.events.on("plugin:added", handleChange);
		pluginManager.events.on("plugin:removed", handleChange);

		return () => {
			pluginManager.events.off("plugin:added", handleChange);
			pluginManager.events.off("plugin:removed", handleChange);
		};
	}, [pluginId]);

	return plugin;
};
