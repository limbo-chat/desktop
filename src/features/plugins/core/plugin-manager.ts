import EventEmitter from "eventemitter3";
import type * as limbo from "limbo";
import { parseNamespacedResourceId } from "../../../lib/utils";
import { PluginContext } from "./plugin-context";

export interface PluginManagerEvents {
	"plugin:added": (pluginId: string) => void;
	"plugin:removed": (pluginId: string) => void;
	"plugin:state-changed": (pluginId: string) => void;
}

export class PluginManager {
	public events: EventEmitter<PluginManagerEvents> = new EventEmitter();
	private plugins: Map<string, PluginContext> = new Map();

	public getPlugin(pluginId: string) {
		const plugin = this.plugins.get(pluginId);

		if (!plugin) {
			throw new Error(`Plugin with id ${pluginId} not found`);
		}

		return plugin;
	}

	public getPlugins() {
		return [...this.plugins.values()];
	}

	public getLLM(llmPath: string) {
		const resourceId = parseNamespacedResourceId(llmPath);

		if (!resourceId) {
			throw new Error(`Invalid LLM id: ${llmPath}. Expected format: namespace/llm-id`);
		}

		const pluginId = resourceId.namespace;
		const llmId = resourceId.resource;

		const plugin = this.getPlugin(pluginId);
		const pluginLLMs = plugin.getRegisteredLLMs();
		const llm = pluginLLMs.find((llm) => llm.id === llmId);

		if (!llm) {
			throw new Error(`LLM with id ${llmId} not found in plugin ${pluginId}`);
		}

		return llm;
	}

	public async activatePlugin(pluginId: string) {
		const plugin = this.getPlugin(pluginId);

		await plugin.activate();
	}

	public async deactivatePlugin(pluginId: string) {
		const plugin = this.getPlugin(pluginId);

		await plugin.deactivate();
	}

	public async activatePlugins() {
		for (const [pluginId, pluginContext] of this.plugins) {
			try {
				await pluginContext.activate();
			} catch (err) {
				console.error(`Failed to activate plugin ${pluginId}:`, err);
			}
		}
	}

	public async deactivatePlugins() {
		for (const [pluginId, pluginContext] of this.plugins) {
			try {
				await pluginContext.deactivate();
			} catch (err) {
				console.log(`Failed to deactivate plugin ${pluginId}:`, err);
			}
		}
	}

	public async addPlugin(pluginId: string, pluginContext: PluginContext) {
		pluginContext.events.on("state:changed", () => {
			this.events.emit("plugin:state-changed", pluginId);
		});

		this.plugins.set(pluginId, pluginContext);

		this.events.emit("plugin:added", pluginId);
	}

	public async removePlugin(pluginId: string) {
		this.plugins.delete(pluginId);

		this.events.emit("plugin:removed", pluginId);
	}

	// lifecycle methods

	public async executeOnAfterChatCreatedHooks(args: limbo.OnAfterChatCreatedArgs) {
		for (const [pluginId, pluginContext] of this.plugins) {
			try {
				await pluginContext.executeOnAfterChatCreated(args);
			} catch {
				// noop
			}
		}
	}

	public async executeOnBeforeGenerateTextHooks(args: limbo.OnBeforeGenerateTextArgs) {
		for (const [pluginId, pluginContext] of this.plugins) {
			try {
				await pluginContext.executeOnBeforeGenerateText(args);
			} catch {
				// noop
			}
		}
	}
}
