import EventEmitter from "eventemitter3";
import { PluginContext } from "./plugin-context";
import type * as limbo from "limbo";
import type { PluginData, PluginManifest } from "../../../../electron/plugins/schemas";
import { PromptBuilder } from "../../chat/core/prompt-builder";

export interface PluginManagerEvents {
	"plugin:added": (pluginId: string) => void;
	"plugin:removed": (pluginId: string) => void;
	"plugin:state-changed": (pluginId: string) => void;
}

export interface PluginManagerHostBridge {
	getPluginData: (pluginId: string) => Promise<{
		manifest: PluginManifest;
		data: PluginData;
		js: string;
	}>;
	showNotification: limbo.API["notifications"]["show"];
	renameChat: limbo.API["chats"]["rename"];
	getChat: limbo.API["chats"]["get"];
	getChatMessages: limbo.API["chats"]["getMessages"];
}

export interface PluginManagerOptions {
	hostBridge: PluginManagerHostBridge;
}

export class PluginManager {
	public events: EventEmitter<PluginManagerEvents> = new EventEmitter();
	private plugins: Map<string, PluginContext> = new Map();
	private hostBridge: PluginManagerHostBridge;

	constructor(opts: PluginManagerOptions) {
		this.hostBridge = opts.hostBridge;
	}

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

	public getActivePlugins() {
		return [...this.plugins.values()].filter((plugin) => plugin.status === "active");
	}

	public getLLM(llmPath: string) {
		const parts = llmPath.split("/");

		if (parts.length !== 2) {
			throw new Error(`Invalid LLM id: ${llmPath}. Expected format: namespace/llm-id`);
		}

		const pluginId = parts[0];
		const llmId = parts[1];

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
		for (const plugin of this.plugins.values()) {
			try {
				await plugin.activate();
			} catch (err) {
				console.error(`Failed to activate plugin: ${plugin.manifest.id}`, err);
			}
		}
	}

	public async deactivatePlugins() {
		for (const plugin of this.plugins.values()) {
			try {
				await plugin.deactivate();
			} catch (err) {
				console.error(`Failed to deactivate plugin: ${plugin.manifest.id}`, err);
			}
		}
	}

	public async loadPlugin(pluginId: string) {
		const pluginData = await this.hostBridge.getPluginData(pluginId);

		const plugin = new PluginContext({
			manifest: pluginData.manifest,
			hostBridge: {
				getLLM: this.getLLM.bind(this),
				getChat: this.hostBridge.getChat,
				getChatMessages: this.hostBridge.getChatMessages,
				renameChat: this.hostBridge.renameChat,
				showNotification: this.hostBridge.showNotification,
			},
		});

		plugin.events.on("state:changed", () => {
			this.events.emit("plugin:state-changed", pluginId);
		});

		for (const [key, val] of Object.entries(pluginData.data.settings)) {
			plugin.setCachedSetting(key, val);
		}

		await plugin.loadModule(pluginData.js);

		this.plugins.set(pluginId, plugin);

		this.events.emit("plugin:added", pluginId);
	}

	public async unloadPlugin(pluginId: string) {
		const plugin = this.getPlugin(pluginId);

		plugin.events.removeAllListeners();

		this.plugins.delete(pluginId);

		this.events.emit("plugin:removed", pluginId);
	}

	public async reloadPlugin(pluginId: string) {
		await this.deactivatePlugin(pluginId);
		await this.unloadPlugin(pluginId);

		await this.loadPlugin(pluginId);
		await this.activatePlugin(pluginId);
	}

	// lifecycle methods

	public async executeOnAfterChatCreatedHooks(args: limbo.OnAfterChatCreatedArgs) {
		const activePlugins = this.getActivePlugins();

		for (const plugin of activePlugins) {
			try {
				await plugin.executeOnAfterChatCreated(args);
			} catch {
				// noop
			}
		}
	}

	public async executeOnBeforeGenerateTextHooks(args: limbo.OnBeforeGenerateTextArgs) {
		const activePlugins = this.getActivePlugins();

		for (const plugin of activePlugins) {
			try {
				await plugin.executeOnBeforeGenerateText(args);
			} catch {
				// noop
			}
		}
	}
}
