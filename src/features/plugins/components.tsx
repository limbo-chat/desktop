import type { PropsWithChildren } from "react";
import { PluginManagerContext } from "./contexts";
import type { PluginManager } from "./core/plugin-manager";
import { useInitialPluginLoader, usePluginHotReloader } from "./hooks";

export interface PluginManagerProviderProps {
	pluginManager: PluginManager;
}

export const PluginManagerProvider = ({
	pluginManager,
	children,
}: PropsWithChildren<PluginManagerProviderProps>) => {
	return <PluginManagerContext value={pluginManager}>{children}</PluginManagerContext>;
};

export const PluginController = () => {
	// load the plugins
	useInitialPluginLoader();

	// setup hot reloading for plugins
	usePluginHotReloader();

	return null;
};
