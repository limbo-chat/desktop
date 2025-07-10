import type * as limbo from "@limbo/api";
import { createPluginAPI } from "./create-plugin-api";
import type { GetPluginResult, PluginBackend } from "./plugin-backend";
import { PluginContext } from "./plugin-context";
import type { PluginManager } from "./plugin-manager";
import type { PluginModuleLoader } from "./plugin-module-loader";

export interface PluginSystemBridge {
	onActivatePluginError: (pluginId: string, message: string | null) => void | Promise<void>;
}

export interface PluginSystemAPIBridge {
	showNotification: limbo.API["notifications"]["show"];
	getChat: limbo.API["chats"]["get"];
	getChatMessages: limbo.API["chats"]["getMessages"];
	renameChat: limbo.API["chats"]["rename"];
	showChatPanel: limbo.API["ui"]["showChatPanel"];
	executeDatabaseQuery: (
		pluginId: string,
		sql: string,
		params?: any[]
	) => Promise<limbo.database.QueryResult>;
}

export interface PluginSystemOptions {
	hostBridge: PluginSystemBridge;
	pluginBackend: PluginBackend;
	pluginAPIBridge: PluginSystemAPIBridge;
	pluginManager: PluginManager;
	pluginModuleLoader: PluginModuleLoader;
}

export class PluginSystem {
	private hostBridge: PluginSystemBridge;
	private pluginBackend: PluginBackend;
	private pluginAPIBridge: PluginSystemAPIBridge;
	private pluginModuleLoader: PluginModuleLoader;
	private pluginManager: PluginManager;

	constructor(opts: PluginSystemOptions) {
		this.hostBridge = opts.hostBridge;
		this.pluginBackend = opts.pluginBackend;
		this.pluginAPIBridge = opts.pluginAPIBridge;
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

		const pluginAPI = createPluginAPI({
			pluginContext,
			hostBridge: {
				getLLM: (llmId) => {
					return this.pluginManager.getLLM(llmId) ?? undefined;
				},
				getChat: (chatId) => {
					return this.pluginAPIBridge.getChat(chatId);
				},
				getChatMessages: (opts) => {
					return this.pluginAPIBridge.getChatMessages(opts);
				},
				renameChat: (chatId, newName) => {
					return this.pluginAPIBridge.renameChat(chatId, newName);
				},
				showNotification: (notification) => {
					return this.pluginAPIBridge.showNotification(notification);
				},
				showChatPanel: (args) => {
					return this.pluginAPIBridge.showChatPanel(args);
				},
				executeDatabaseQuery: (sql, params) => {
					return this.pluginAPIBridge.executeDatabaseQuery(
						plugin.manifest.id,
						sql,
						params
					);
				},
			},
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

		if (typeof pluginModule.onActivate === "function") {
			try {
				await pluginModule.onActivate();
			} catch (err) {
				let errMessage = null;

				if (err instanceof Error) {
					errMessage = err.message;
				}

				await this.hostBridge.onActivatePluginError(plugin.manifest.id, errMessage);

				throw err;
			}
		}

		this.pluginManager.addPlugin(plugin.manifest.id, {
			manifest: plugin.manifest,
			module: pluginModule,
			context: pluginContext,
		});
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
