import type { PropsWithChildren } from "react";
import { PluginManagerContext } from "./contexts";
import type { PluginManager } from "./core/plugin-manager";

export interface PluginManagerProviderProps {
	pluginManager: PluginManager;
}

export const PluginManagerProvider = ({
	pluginManager,
	children,
}: PropsWithChildren<PluginManagerProviderProps>) => {
	return <PluginManagerContext value={pluginManager}>{children}</PluginManagerContext>;
};
