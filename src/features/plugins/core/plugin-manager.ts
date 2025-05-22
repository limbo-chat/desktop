import EventEmitter from "eventemitter3";
import type * as limbo from "limbo";
import type { PluginManifest } from "../../../../electron/plugins/schemas";
import { parseNamespacedResourceId } from "../../../lib/utils";
import { PluginContext } from "./plugin-context";

export interface PluginManagerEvents {
	"plugin:added": (pluginId: string) => void;
	"plugin:removed": (pluginId: string) => void;
	"plugin:state-changed": (pluginId: string) => void;
}

export interface ActivePlugin {
	context: PluginContext;
	manifest: PluginManifest;
	module: limbo.Plugin;
}

export class PluginManager {
	public events: EventEmitter<PluginManagerEvents> = new EventEmitter();
	private plugins: Map<string, ActivePlugin> = new Map();

	public getPlugin(pluginId: string) {
		return this.plugins.get(pluginId);
	}

	public getPlugins() {
		return [...this.plugins.values()];
	}

	public async addPlugin(pluginId: string, plugin: ActivePlugin) {
		plugin.context.events.on("state:changed", () => {
			this.events.emit("plugin:state-changed", pluginId);
		});

		this.plugins.set(pluginId, plugin);

		this.events.emit("plugin:added", pluginId);
	}

	public async removePlugin(pluginId: string) {
		this.plugins.delete(pluginId);

		this.events.emit("plugin:removed", pluginId);
	}

	public getLLM(llmPath: string) {
		const resourceId = parseNamespacedResourceId(llmPath);

		if (!resourceId) {
			return null;
		}

		const pluginId = resourceId.namespace;
		const llmId = resourceId.resource;

		const plugin = this.getPlugin(pluginId);

		if (!plugin) {
			return null;
		}

		const llm = plugin.context.getLLM(llmId);

		if (!llm) {
			return null;
		}

		return llm;
	}

	// lifecycle helpers

	public async executeOnAfterChatCreatedHooks(args: limbo.OnAfterChatCreatedArgs) {
		for (const plugin of this.plugins.values()) {
			if (typeof plugin.module.onAfterChatCreated !== "function") {
				continue;
			}

			try {
				await plugin.module.onAfterChatCreated(args);
			} catch {
				// noop
			}
		}
	}

	public async executeOnBeforeGenerateTextHooks(args: limbo.OnBeforeGenerateTextArgs) {
		for (const plugin of this.plugins.values()) {
			if (typeof plugin.module.onAfterChatCreated !== "function") {
				continue;
			}

			try {
				await plugin.module.onAfterChatCreated(args);
			} catch {
				// noop
			}
		}
	}
}
