import EventEmitter from "eventemitter3";
import type * as limbo from "limbo";
import type { PluginManifest } from "../../../../electron/plugins/schemas";

export interface PluginContextEvents {
	"activate": () => void;
	"deactivate": () => void;
	"state:changed": () => void;
}

export interface PluginHostBridge {
	getLLM: limbo.API["models"]["getLLM"];
	showNotification: limbo.API["notifications"]["show"];
	renameChat: limbo.API["chats"]["rename"];
	getChat: limbo.API["chats"]["get"];
	getChatMessages: limbo.API["chats"]["getMessages"];
}

export type PluginContextStatus = "active" | "inactive";

export interface PluginContextOptions {
	manifest: PluginManifest;
	hostBridge: PluginHostBridge;
}

export class PluginContext {
	public events: EventEmitter<PluginContextEvents> = new EventEmitter();
	public manifest: PluginManifest;
	public status: PluginContextStatus = "inactive";
	private pluginModule: limbo.Plugin | null = null;
	private hostBridge: PluginHostBridge;
	private settingsCache: Map<string, any> = new Map();

	// plugin state
	private registeredSettings: limbo.Setting[] = [];
	private registeredLLMs: limbo.LLM[] = [];

	constructor(opts: PluginContextOptions) {
		this.manifest = opts.manifest;
		this.hostBridge = opts.hostBridge;
	}

	public getPluginModule() {
		return this.pluginModule;
	}

	public getCachedSetting(settingId: string) {
		return this.settingsCache.get(settingId);
	}

	public setCachedSetting(settingId: string, value: any) {
		this.settingsCache.set(settingId, value);
	}

	public loadModule(jsSrc: string) {
		const pluginAPI = this.createPluginAPI();

		const sandboxedImports: Record<string, any> = {
			limbo: pluginAPI,
		};

		const sandboxedRequire = (moduleId: string) => {
			const resolvedModule = sandboxedImports[moduleId];

			if (!resolvedModule) {
				throw new Error(
					`Plugin "${this.manifest.id}" attempted to import an unknown module "${moduleId}"`
				);
			}

			return resolvedModule;
		};

		const sandboxedModule: Record<string, any> = {};

		const pluginFactory = eval(
			`(require,module)=>{${jsSrc}}//# sourceURL=plugin:${this.manifest.id}`
		);

		pluginFactory(sandboxedRequire, sandboxedModule);

		if (typeof sandboxedModule.exports !== "object") {
			throw new Error(`Plugin "${this.manifest.id}" did not export a valid plugin module.`);
		}

		this.pluginModule = sandboxedModule.exports;
	}

	public resetState() {
		this.registeredSettings = [];
		this.registeredLLMs = [];
	}

	public async activate() {
		if (this.status === "active" || !this.pluginModule) {
			return;
		}

		this.status = "active";

		this.events.emit("activate");

		if (typeof this.pluginModule.onActivate === "function") {
			await this.pluginModule.onActivate();
		}
	}

	public async deactivate() {
		if (this.status === "inactive" || !this.pluginModule) {
			return;
		}

		this.status = "inactive";

		this.resetState();

		this.events.emit("deactivate");

		if (typeof this.pluginModule.onDeactivate === "function") {
			await this.pluginModule.onDeactivate();
		}
	}

	public async executeOnAfterChatCreated(args: limbo.OnAfterChatCreatedArgs) {
		if (this.status !== "active" || !this.pluginModule) {
			return;
		}

		if (typeof this.pluginModule.onAfterChatCreated === "function") {
			await this.pluginModule.onAfterChatCreated(args);
		}
	}

	public async executeOnBeforeGenerateText(args: limbo.OnBeforeGenerateTextArgs) {
		if (this.status !== "active" || !this.pluginModule) {
			return;
		}

		if (typeof this.pluginModule.onBeforeGenerateText === "function") {
			await this.pluginModule.onBeforeGenerateText(args);
		}
	}

	public getRegisteredSettings() {
		return this.registeredSettings;
	}

	public getRegisteredLLMs() {
		return this.registeredLLMs;
	}

	private createPluginAPI(): limbo.API {
		return {
			settings: {
				register: (setting) => {
					this.registeredSettings.push(setting);

					this.events.emit("state:changed");
				},
				unregister: (settingId) => {
					this.registeredSettings = this.registeredSettings.filter(
						(setting) => setting.id !== settingId
					);

					this.events.emit("state:changed");
				},
				get: (settingId) => {
					return this.settingsCache.get(settingId);
				},
			},
			models: {
				getLLM: this.hostBridge.getLLM,
				registerLLM: (llm) => {
					this.registeredLLMs.push(llm);

					this.events.emit("state:changed");
				},
				unregisterLLM: (llmId) => {
					this.registeredLLMs = this.registeredLLMs.filter((llm) => llm.id !== llmId);

					this.events.emit("state:changed");
				},
			},
			notifications: {
				show: this.hostBridge.showNotification,
			},
			chats: {
				get: async (args) => {
					try {
						return await this.hostBridge.getChat(args);
					} catch {
						throw new Error("Failed to get chat");
					}
				},
				rename: async (chatId, newName) => {
					try {
						return await this.hostBridge.renameChat(chatId, newName);
					} catch {
						throw new Error("Failed to rename chat");
					}
				},
				getMessages: async (args) => {
					try {
						return await this.hostBridge.getChatMessages(args);
					} catch {
						throw new Error("Failed to get chat messages");
					}
				},
			},
		};
	}
}
