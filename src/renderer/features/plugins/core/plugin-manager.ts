import type * as limbo from "@limbo-chat/api";
import EventEmitter from "eventemitter3";
import type { PluginManifest } from "../../../../main/plugins/schemas";
import { parseNamespacedResourceId } from "../../../lib/utils";
import { PluginContext } from "./plugin-context";

export interface PluginManagerEvents {
	"plugin:added": (pluginId: string) => void;
	"plugin:removed": (pluginId: string) => void;
	"plugin:setting:registered": (pluginId: string, setting: limbo.Setting) => void;
	"plugin:setting:unregistered": (pluginId: string, settingId: string) => void;
	"plugin:command:registered": (pluginId: string, command: limbo.Command) => void;
	"plugin:command:unregistered": (pluginId: string, commandId: string) => void;
	"plugin:llm:registered": (pluginId: string, llm: limbo.LLM) => void;
	"plugin:llm:unregistered": (pluginId: string, llmId: string) => void;
	"plugin:tool:registered": (pluginId: string, tool: limbo.Tool) => void;
	"plugin:tool:unregistered": (pluginId: string, toolId: string) => void;
	"plugin:markdown-element:registered": (
		pluginId: string,
		markdownElement: limbo.ui.MarkdownElement
	) => void;
	"plugin:markdown-element:unregistered": (pluginId: string, markdownElementId: string) => void;
	"plugin:chat-node:registered": (pluginId: string, chatNode: limbo.ui.ChatNode) => void;
	"plugin:chat-node:unregistered": (pluginId: string, chatNodeId: string) => void;
	"plugin:chat-panel:registered": (pluginId: string, chatNode: limbo.ui.ChatPanel) => void;
	"plugin:chat-panel:unregistered": (pluginId: string, chatPanelId: string) => void;
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

		plugin.context.events.on("setting:registered", (setting) => {
			this.events.emit("plugin:setting:registered", pluginId, setting);
		});

		plugin.context.events.on("setting:unregistered", (settingId) => {
			this.events.emit("plugin:setting:unregistered", pluginId, settingId);
		});

		plugin.context.events.on("command:registered", (command) => {
			this.events.emit("plugin:command:registered", pluginId, command);
		});

		plugin.context.events.on("command:unregistered", (commandId) => {
			this.events.emit("plugin:command:unregistered", pluginId, commandId);
		});

		plugin.context.events.on("llm:registered", (llm) => {
			this.events.emit("plugin:llm:registered", pluginId, llm);
		});

		plugin.context.events.on("llm:unregistered", (llmId) => {
			this.events.emit("plugin:llm:unregistered", pluginId, llmId);
		});

		plugin.context.events.on("tool:registered", (tool) => {
			this.events.emit("plugin:tool:registered", pluginId, tool);
		});

		plugin.context.events.on("tool:unregistered", (toolId) => {
			this.events.emit("plugin:tool:unregistered", pluginId, toolId);
		});

		plugin.context.events.on("markdown-element:registered", (markdownElement) => {
			this.events.emit("plugin:markdown-element:registered", pluginId, markdownElement);
		});

		plugin.context.events.on("markdown-element:unregistered", (markdownElementId) => {
			this.events.emit("plugin:markdown-element:unregistered", pluginId, markdownElementId);
		});

		plugin.context.events.on("chat-node:registered", (chatNode) => {
			this.events.emit("plugin:chat-node:registered", pluginId, chatNode);
		});

		plugin.context.events.on("chat-node:unregistered", (chatNodeId) => {
			this.events.emit("plugin:chat-node:unregistered", pluginId, chatNodeId);
		});

		plugin.context.events.on("chat-panel:registered", (chatPanel) => {
			this.events.emit("plugin:chat-panel:registered", pluginId, chatPanel);
		});

		plugin.context.events.on("chat-panel:unregistered", (chatPanelId) => {
			this.events.emit("plugin:chat-panel:unregistered", pluginId, chatPanelId);
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
