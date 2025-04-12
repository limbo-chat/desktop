import EventEmitter from "eventemitter3";
import type * as limbo from "limbo";
import type { PluginManifest } from "../../../../electron/plugins/schemas";

export interface PluginModule {
	activate: () => Promise<void>;
	deactivate?: () => Promise<void>;
}

export interface PluginEvents {
	activate: () => void;
	deactivate: () => void;
	notification: (notification: limbo.Notification) => void;
	registeredSetting: (settings: limbo.Setting) => void;
	unregisteredSetting: (settingId: string) => void;
	registeredLLM: (llms: limbo.LLM) => void;
	unregisteredLLM: (llmId: string) => void;
}

export interface PluginOptions {
	manifest: PluginManifest;
	js: string;
}

export class Plugin {
	public manifest: PluginManifest;
	public events: EventEmitter<PluginEvents> = new EventEmitter();
	public isActive: boolean = false;
	private js: string;
	private api: limbo.API;
	private pluginModule: PluginModule | null = null;
	private settingsCache: Map<string, any> = new Map();

	// plugin state
	private registeredSettings: limbo.Setting[] = [];
	private registeredLLMs: limbo.LLM[] = [];

	constructor(opts: PluginOptions) {
		this.manifest = opts.manifest;
		this.js = opts.js;

		this.api = {
			notifications: {
				show: (notification) => {
					this.events.emit("notification", notification);
				},
			},
			settings: {
				register: (setting) => {
					this.registeredSettings.push(setting);

					this.events.emit("registeredSetting", setting);
				},
				unregister: (settingId) => {
					this.registeredSettings = this.registeredSettings.filter(
						(setting) => setting.id !== settingId
					);

					this.events.emit("unregisteredSetting", settingId);
				},
				get: (settingId) => {
					return this.settingsCache.get(settingId);
				},
			},
			llms: {
				register: (llm) => {
					this.registeredLLMs.push(llm);

					this.events.emit("registeredLLM", llm);
				},
				unregister: (llmId) => {
					this.registeredLLMs = this.registeredLLMs.filter((llm) => llm.id !== llmId);

					this.events.emit("unregisteredLLM", llmId);
				},
			},
		};
	}

	public setManifest(manifest: PluginManifest) {
		this.manifest = manifest;
	}

	public setJS(js: string) {
		this.js = js;
	}

	public getCachedSetting(settingId: string) {
		return this.settingsCache.get(settingId);
	}

	public setCachedSetting(settingId: string, value: any) {
		this.settingsCache.set(settingId, value);
	}

	public setSettingsCache(settingsMap: Map<string, any>) {
		this.settingsCache = settingsMap;
	}

	public loadModule() {
		const sandboxedImports: Record<string, any> = {
			limbo: this.api,
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

		const sandboxedExports: Record<string, any> = {};

		const pluginFactory = eval(
			`(require,exports)=>{${this.js}}//# sourceURL=plugin:${this.manifest.id}`
		);

		pluginFactory(sandboxedRequire, sandboxedExports);

		const activateFn = sandboxedExports.activate;
		const deactivateFn = sandboxedExports.deactivate;

		// plugins must have an activate function
		if (typeof activateFn !== "function") {
			throw new Error(`Plugin must export an "activate" function`);
		}

		// if the deactivate function is defined, it has to be function
		if (deactivateFn !== undefined && typeof deactivateFn !== "function") {
			throw new Error(`"deactivate" must be a function`);
		}

		this.pluginModule = {
			activate: activateFn,
			deactivate: deactivateFn,
		};
	}

	public resetState() {
		this.registeredSettings = [];
		this.registeredLLMs = [];
	}

	public async activate() {
		if (this.isActive || !this.pluginModule) {
			return;
		}

		this.isActive = true;

		this.events.emit("activate");

		await this.pluginModule.activate();
	}

	public async deactivate() {
		if (!this.isActive || !this.pluginModule) {
			return;
		}

		this.isActive = false;

		this.resetState();

		this.events.emit("deactivate");

		// the deactivate function is optional, but if it exists it should be called
		if (typeof this.pluginModule.deactivate === "function") {
			await this.pluginModule.deactivate();
		}
	}

	public getRegisteredSettings() {
		return this.registeredSettings;
	}

	public getRegisteredLLMs() {
		return this.registeredLLMs;
	}
}
