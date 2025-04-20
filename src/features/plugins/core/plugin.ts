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
	stateChange: () => void;
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
	private pluginModule: PluginModule | null = null;
	private settingsCache: Map<string, any> = new Map();

	// plugin state
	private registeredSettings: limbo.Setting[] = [];
	private registeredLLMs: limbo.LLM[] = [];

	// hook callbacks
	private onBeforeGenerateTextCallbacks: ((
		args: limbo.hooks.onBeforeGenerateText.Args
	) => void | Promise<void>)[] = [];

	constructor(opts: PluginOptions) {
		this.manifest = opts.manifest;
		this.js = opts.js;
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

	public getOnBeforeGenerateTextCallbacks() {
		return this.onBeforeGenerateTextCallbacks;
	}

	private createPluginAPI(): limbo.API {
		return {
			notifications: {
				show: (notification) => {
					this.events.emit("notification", notification);
				},
			},
			settings: {
				register: (setting) => {
					this.registeredSettings.push(setting);

					this.events.emit("stateChange");
				},
				unregister: (settingId) => {
					this.registeredSettings = this.registeredSettings.filter(
						(setting) => setting.id !== settingId
					);

					this.events.emit("stateChange");
				},
				get: (settingId) => {
					return this.settingsCache.get(settingId);
				},
			},
			llms: {
				register: (llm) => {
					this.registeredLLMs.push(llm);

					this.events.emit("stateChange");
				},
				unregister: (llmId) => {
					this.registeredLLMs = this.registeredLLMs.filter((llm) => llm.id !== llmId);

					this.events.emit("stateChange");
				},
			},
			hooks: {
				onBeforeGenerateText: (cb) => {
					this.onBeforeGenerateTextCallbacks.push(cb);
				},
			},
		};
	}
}
