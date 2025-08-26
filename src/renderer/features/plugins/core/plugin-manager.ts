import type * as limbo from "@limbo-chat/api";
import EventEmitter from "eventemitter3";
import type { PluginManifest } from "../../../../main/plugins/schemas";
import { parseNamespacedResourceId } from "../../../lib/utils";
import { PluginContext } from "./plugin-context";

export interface PluginManagerEvents {
	"plugin:added": (pluginId: string) => void;
	"plugin:removed": (pluginId: string) => void;
	"plugin:state-changed": (pluginId: string) => void;
	"plugin:llm-registered": (pluginId: string, llm: limbo.LLM) => void;
	"plugin:llm-unregistered": (pluginId: string, llmId: string) => void;
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
		this.plugins.set(pluginId, plugin);

		plugin.context.events.on("state:changed", () => {
			this.events.emit("plugin:state-changed", pluginId);
		});

		plugin.context.events.on("llm:registered", (llm) => {
			this.events.emit("plugin:llm-registered", pluginId, llm);
		});

		plugin.context.events.on("llm:unregistered", (llm) => {
			this.events.emit("plugin:llm-unregistered", pluginId, llm);
		});

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

	public async executeOnChatCreatedHooks(args: limbo.OnChatCreatedArgs) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onChatCreated !== "function") {
					return;
				}

				await plugin.module.onChatCreated(args);
			})
		);
	}

	public async executeOnChatDeletedHooks(chatId: string) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onChatDeleted !== "function") {
					return;
				}

				await plugin.module.onChatDeleted(chatId);
			})
		);
	}

	public async executeOnChatsDeletedHooks(chatIds: string[]) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onChatsDeleted !== "function") {
					return;
				}

				await plugin.module.onChatsDeleted(chatIds);
			})
		);
	}

	public async executeOnBeforeChatGenerationHooks(args: limbo.OnBeforeChatGenerationArgs) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onBeforeChatGeneration !== "function") {
					return;
				}

				await plugin.module.onBeforeChatGeneration(args);
			})
		);
	}

	public async executeOnBeforeChatIterationHooks(args: limbo.OnBeforeChatIterationArgs) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onBeforeChatIteration !== "function") {
					return;
				}

				await plugin.module.onBeforeChatIteration(args);
			})
		);
	}

	public async executeOnAfterChatIterationHooks(args: limbo.OnAfterChatIterationArgs) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onAfterChatIteration !== "function") {
					return;
				}

				await plugin.module.onAfterChatIteration(args);
			})
		);
	}

	public async executeOnAfterChatGenerationHooks(args: limbo.OnAfterChatGenerationArgs) {
		const plugins = [...this.plugins.values()];

		await Promise.allSettled(
			plugins.map(async (plugin) => {
				if (typeof plugin.module.onAfterChatGeneration !== "function") {
					return;
				}

				await plugin.module.onAfterChatGeneration(args);
			})
		);
	}
}
