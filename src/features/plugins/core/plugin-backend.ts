import type { PluginData, PluginManifest } from "../../../../electron/plugins/schemas";

export interface GetPluginResult {
	manifest: PluginManifest;
	js: string;
	data: PluginData;
}

export interface PluginBackend {
	getPlugin: (pluginId: string) => GetPluginResult | Promise<GetPluginResult>;
	getAllPlugins: () => GetPluginResult[] | Promise<GetPluginResult[]>;
	enablePlugin: (pluginId: string) => void | Promise<void>;
	disablePlugin: (pluginId: string) => void | Promise<void>;
	uninstallPlugin: (pluginId: string) => void | Promise<void>;
}
