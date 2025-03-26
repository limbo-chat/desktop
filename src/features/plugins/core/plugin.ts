import type { PluginManifest } from "../../../../electron/plugins/schemas";
import { PluginAPI } from "./plugin-api";

export interface PluginModule {
	activate: () => Promise<void>;
	deactivate?: () => Promise<void>;
}

export interface CreatePluginOptions {
	manifest: any;
	js: string;
}

export interface PluginOptions {
	manifest: any;
	api: PluginAPI;
	module: PluginModule;
}

export class Plugin {
	public manifest: PluginManifest;
	public isActive: boolean;
	public api: PluginAPI;
	private pluginModule: PluginModule;

	constructor(opts: PluginOptions) {
		this.api = opts.api;
		this.isActive = false;
		this.manifest = opts.manifest;
		this.pluginModule = opts.module;
	}

	static async create(opts: CreatePluginOptions) {
		const api = new PluginAPI();

		const sandboxedImports: Record<string, any> = {
			limbo: api,
			react: await import("react"),
		};

		const sandboxedRequire = (moduleId: string) => {
			const resolvedModule = sandboxedImports[moduleId];

			if (!resolvedModule) {
				throw new Error(
					`Plugin "${opts.manifest.id}" attempted to import an unknown module "${moduleId}"`
				);
			}

			return resolvedModule;
		};

		const sandboxedModule = {
			exports: {} as any,
		};

		const pluginFactory = eval(
			`(require,module)=>{${opts.js}}//# sourceURL=plugin:${opts.manifest.id}`
		);

		pluginFactory(sandboxedRequire, sandboxedModule);

		const activateFn = sandboxedModule.exports.activate;
		const deactivateFn = sandboxedModule.exports.deactivate;

		// plugins must have an activate function
		if (typeof activateFn !== "function") {
			throw new Error(`Plugin must export an "activate" function`);
		}

		// if the deactivate function is defined, it has to be function
		if (deactivateFn !== undefined && typeof deactivateFn !== "function") {
			throw new Error(`"deactivate" must be a function`);
		}

		const pluginModule: PluginModule = {
			activate: activateFn,
			deactivate: deactivateFn,
		};

		return new Plugin({
			api,
			manifest: opts.manifest,
			module: pluginModule,
		});
	}

	public async activate() {
		if (this.isActive) {
			return;
		}

		this.isActive = true;

		await this.pluginModule.activate();
	}

	public async deactivate() {
		if (!this.isActive) {
			return;
		}

		this.isActive = false;

		if (typeof this.pluginModule.deactivate === "function") {
			await this.pluginModule.deactivate();
		}
	}
}
