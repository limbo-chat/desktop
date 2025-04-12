import type { PropsWithChildren } from "react";
import type { PluginManager } from "../core/plugin-manager";
import { PluginManagerContext } from "../contexts";

export interface PluginManagerProviderProps {
	pluginManager: PluginManager;
}

export const PluginManagerProvider = ({
	pluginManager,
	children,
}: PropsWithChildren<PluginManagerProviderProps>) => {
	return <PluginManagerContext value={pluginManager}>{children}</PluginManagerContext>;
};
