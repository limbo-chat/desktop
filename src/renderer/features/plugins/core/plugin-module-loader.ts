import type * as limbo from "@limbo/api";
import type { PluginManifest } from "../../../../electron/plugins/schemas";

export interface LoadModuleOptions {
	pluginManifest: PluginManifest;
	pluginAPI: limbo.API;
	js: string;
}

export interface PluginModuleLoader {
	loadModule: (opts: LoadModuleOptions) => limbo.Plugin | Promise<limbo.Plugin>;
}

export class EvalPluginModuleLoader implements PluginModuleLoader {
	async loadModule(opts: LoadModuleOptions) {
		const sandboxedImports: Record<string, any> = {
			"limbo": opts.pluginAPI,
			"react": await import("react"),
			"react/jsx-runtime": await import("react/jsx-runtime"),
		};

		const sandboxedRequire = (moduleId: string) => {
			const resolvedModule = sandboxedImports[moduleId];

			if (!resolvedModule) {
				throw new Error(`Plugin attempted to import an unknown module "${moduleId}"`);
			}

			return resolvedModule;
		};

		const sandboxedModule: Record<string, any> = {};

		const pluginFactory = eval(
			`(require,module)=>{${opts.js}}//# sourceURL=plugin:${opts.pluginManifest.id}`
		);

		pluginFactory(sandboxedRequire, sandboxedModule);

		if (typeof sandboxedModule.exports !== "object") {
			throw new Error(`Plugin did not export a valid plugin module`);
		}

		return sandboxedModule.exports;
	}
}
