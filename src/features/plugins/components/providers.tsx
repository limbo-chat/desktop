import type { PropsWithChildren } from "react";
import { pluginManagerContext, pluginSystemContext, pluginBackendContext } from "../contexts";
import type { PluginBackend } from "../core/plugin-backend";
import type { PluginManager } from "../core/plugin-manager";
import type { PluginSystem } from "../core/plugin-system";

export interface PluginManagerProviderProps {
	pluginManager: PluginManager;
}

export const PluginManagerProvider = ({
	pluginManager,
	children,
}: PropsWithChildren<PluginManagerProviderProps>) => {
	return (
		<pluginManagerContext.Provider value={pluginManager}>
			{children}
		</pluginManagerContext.Provider>
	);
};

export interface PluginSystemProviderProps {
	pluginSystem: PluginSystem;
}

export const PluginSystemProvider = ({
	pluginSystem,
	children,
}: PropsWithChildren<PluginSystemProviderProps>) => {
	return (
		<pluginSystemContext.Provider value={pluginSystem}>{children}</pluginSystemContext.Provider>
	);
};

export interface PluginBackendProviderProps {
	pluginBackend: PluginBackend;
}

export const PluginBackendProvider = ({
	pluginBackend,
	children,
}: PropsWithChildren<PluginBackendProviderProps>) => {
	return (
		<pluginBackendContext.Provider value={pluginBackend}>
			{children}
		</pluginBackendContext.Provider>
	);
};
