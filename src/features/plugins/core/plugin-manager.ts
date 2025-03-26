import type { Plugin } from "./plugin";

export class PluginManager {
	private plugins: Plugin[];

	constructor() {
		this.plugins = [];
	}

	public addPlugin(plugin: Plugin) {
		this.plugins.push(plugin);
	}

	public async activatePlugins() {
		for (const plugin of this.plugins) {
			await plugin.activate();
		}
	}

	public async deactivatePlugins() {
		for (const plugin of this.plugins) {
			await plugin.deactivate();
		}
	}

	public async deactivatePlugin(pluginId: string) {
		const plugin = this.plugins.find((p) => p.manifest.id === pluginId);

		if (!plugin) {
			return;
		}

		await plugin.deactivate();
	}
}
