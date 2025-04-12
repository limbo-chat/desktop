import EventEmitter from "eventemitter3";
import type { Plugin } from "./plugin";

export interface PluginManagerEvents {
	pluginAdded: (pluginId: string) => void;
	pluginRemoved: (pluginId: string) => void;
}

export class PluginManager {
	public events: EventEmitter<PluginManagerEvents> = new EventEmitter();
	private plugins: Map<string, Plugin> = new Map();

	public getPlugins() {
		return [...this.plugins.values()];
	}

	public getPlugin(pluginId: string) {
		return this.plugins.get(pluginId);
	}

	public addPlugin(pluginId: string, plugin: Plugin) {
		this.plugins.set(pluginId, plugin);

		this.events.emit("pluginAdded", pluginId);
	}

	public async removePlugin(pluginId: string) {
		this.plugins.delete(pluginId);

		this.events.emit("pluginRemoved", pluginId);
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
