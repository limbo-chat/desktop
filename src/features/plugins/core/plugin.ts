import EventEmitter from "eventemitter3";
import type * as PluginAPI from "limbo";
import type { PluginManifest } from "../../../../electron/plugins/schemas";

export interface PluginModule {
	activate: () => Promise<void>;
	deactivate?: () => Promise<void>;
}

export interface PluginEvents {
	activate: () => void;
	deactivate: () => void;
	notification: (notification: PluginAPI.Notification) => void;
	registeredSetting: (settings: PluginAPI.Setting) => void;
	unregisteredSetting: (settingId: string) => void;
	registeredLLM: (llms: PluginAPI.LLM) => void;
	unregisteredLLM: (llmId: string) => void;
	registeredToolbarToggle: (toolbarToggle: PluginAPI.ToolbarToggle) => void;
	unregisteredToolbarToggle: (toolbarToggleId: string) => void;
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
	private api: PluginAPI.API;
	private pluginModule: PluginModule | null = null;

	// plugin state
	private registeredSettings: PluginAPI.Setting[] = [];
	private registeredLLMs: PluginAPI.LLM[] = [];
	private registeredToolbarToggles: PluginAPI.ToolbarToggle[] = [];

	constructor(opts: PluginOptions) {
		this.manifest = opts.manifest;
		this.js = opts.js;
		this.api = this.createAPI();
	}

	private createAPI(): PluginAPI.API {
		return {
			showNotification: (notification) => {
				this.events.emit("notification", notification);
			},
			registerSetting: (setting) => {
				this.registeredSettings.push(setting);

				this.events.emit("registeredSetting", setting);
			},
			unregisterSetting: (settingId) => {
				this.registeredSettings = this.registeredSettings.filter(
					(setting) => setting.id !== settingId
				);

				this.events.emit("unregisteredSetting", settingId);
			},
			registerLLM: (llm) => {
				this.registeredLLMs.push(llm);

				this.events.emit("registeredLLM", llm);
			},
			unregisterLLM: (llmId) => {
				this.registeredLLMs = this.registeredLLMs.filter((llm) => llm.id !== llmId);

				this.events.emit("unregisteredLLM", llmId);
			},
			registerToolbarToggle: (toolbarToggle) => {
				this.registeredToolbarToggles.push(toolbarToggle);

				this.events.emit("registeredToolbarToggle", toolbarToggle);
			},
			unregisterToolbarToggle: (toolbarToggleId) => {
				this.registeredToolbarToggles = this.registeredToolbarToggles.filter(
					(toolbarToggle) => toolbarToggle.id !== toolbarToggleId
				);

				this.events.emit("unregisteredToolbarToggle", toolbarToggleId);
			},
		};
	}

	public async loadModule() {
		const sandboxedImports: Record<string, any> = {
			limbo: this.api,
			react: await import("react"),
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

		this.events.emit("deactivate");

		this.isActive = false;

		if (typeof this.pluginModule.deactivate === "function") {
			await this.pluginModule.deactivate();
		}
	}
}
