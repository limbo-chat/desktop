import type { PluginMeta, PluginManifest } from "../../../../main/plugins/schemas";

export interface GetPluginResult {
	manifest: PluginManifest;
	js: string;
	meta: PluginMeta;
}

export interface PluginBackend {
	getPlugin: (pluginId: string) => GetPluginResult | Promise<GetPluginResult>;
	getAllPlugins: () => GetPluginResult[] | Promise<GetPluginResult[]>;
	enablePlugin: (pluginId: string) => void | Promise<void>;
	disablePlugin: (pluginId: string) => void | Promise<void>;
	updatePluginSettings: (pluginId: string, settings: any) => void | Promise<void>;
	uninstallPlugin: (pluginId: string) => void | Promise<void>;
}
