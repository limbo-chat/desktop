import type { PluginAPIFactory } from "./plugin-api-factory";
import type { GetPluginResult, PluginBackend } from "./plugin-backend";
import { PluginContext } from "./plugin-context";
import type { PluginManager } from "./plugin-manager";
import type { PluginModuleLoader } from "./plugin-module-loader";

export interface PluginSystemBridge {
	onActivatePluginError: (pluginId: string, message: string | null) => void;
}

export interface PluginSystemOptions {
	hostBridge: PluginSystemBridge;
	pluginBackend: PluginBackend;
	pluginAPIFactory: PluginAPIFactory;
	pluginManager: PluginManager;
	pluginModuleLoader: PluginModuleLoader;
}

export class PluginSystem {
	private hostBridge: PluginSystemBridge;
	private pluginAPIFactory: PluginAPIFactory;
	private pluginBackend: PluginBackend;
	private pluginModuleLoader: PluginModuleLoader;
	private pluginManager: PluginManager;

	constructor(opts: PluginSystemOptions) {
		this.hostBridge = opts.hostBridge;
		this.pluginBackend = opts.pluginBackend;
		this.pluginAPIFactory = opts.pluginAPIFactory;
		this.pluginManager = opts.pluginManager;
		this.pluginModuleLoader = opts.pluginModuleLoader;
	}

	public async loadPlugin(plugin: GetPluginResult) {
		// don't do anything if the plugin is not enabled
		if (!plugin.meta.enabled) {
			return;
		}

		const pluginContext = new PluginContext();

		const settings = await this.pluginBackend.getPluginSettings(plugin.manifest.id);

		for (const setting of settings) {
			pluginContext.setCachedSettingValue(setting.id, setting.value);
		}

		const pluginAPI = this.pluginAPIFactory.create({
			pluginId: plugin.manifest.id,
			pluginContext,
		});

		let pluginModule;

		try {
			pluginModule = await this.pluginModuleLoader.loadModule({
				pluginAPI,
				js: plugin.js,
				pluginManifest: plugin.manifest,
			});
		} catch (err) {
			let errMessage = null;

			if (err instanceof Error) {
				errMessage = err.message;
			}

			await this.hostBridge.onActivatePluginError(plugin.manifest.id, errMessage);

			throw err;
		}

		this.pluginManager.addPlugin(plugin.manifest.id, {
			manifest: plugin.manifest,
			module: pluginModule,
			context: pluginContext,
		});

		if (typeof pluginModule.onActivate === "function") {
			try {
				await pluginModule.onActivate();
			} catch (err) {
				let errMessage = null;

				if (err instanceof Error) {
					errMessage = err.message;
				}

				this.hostBridge.onActivatePluginError(plugin.manifest.id, errMessage);

				throw err;
			}
		}
	}

	public async unloadPlugin(pluginId: string) {
		const plugin = this.pluginManager.getPlugin(pluginId);

		if (!plugin) {
			return;
		}

		if (typeof plugin.module.onDeactivate === "function") {
			await plugin.module.onDeactivate();
		}

		// destroy the event listeners
		plugin.context.destroy();

		this.pluginManager.removePlugin(pluginId);
	}
}
