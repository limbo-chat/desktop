import type { Plugin } from "./plugin";

export class PluginManager {
	private plugins = new Map<string, Plugin>();

	public getActivePlugins() {
		const activePlugins: Plugin[] = [];

		for (const plugin of this.plugins.values()) {
			activePlugins.push(plugin);
		}

		return activePlugins;
	}

	public getPlugin(pluginId: string): Plugin | null {
		return this.plugins.get(pluginId) || null;
	}

	public addPlugin(pluginId: string, plugin: Plugin) {
		this.plugins.set(pluginId, plugin);
	}

	public async removePlugin(pluginId: string) {
		this.plugins.delete(pluginId);
	}

	public async activatePlugins() {
		for (const plugin of this.plugins.values()) {
			await plugin.activate();
		}
	}

	public async deactivatePlugins() {
		for (const plugin of this.plugins.values()) {
			await plugin.deactivate();
		}
	}
}
