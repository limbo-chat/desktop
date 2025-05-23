import type * as limbo from "limbo";
import type { PluginContext } from "./plugin-context";

export interface PluginAPIHostBridge {
	getLLM: limbo.API["models"]["getLLM"];
	showNotification: limbo.API["notifications"]["show"];
	renameChat: limbo.API["chats"]["rename"];
	getChat: limbo.API["chats"]["get"];
	getChatMessages: limbo.API["chats"]["getMessages"];
}

export interface PluginAPIBuilderOptions {
	hostBridge: PluginAPIHostBridge;
	pluginContext: PluginContext;
}

export class PluginAPIBuilder {
	private hostBridge: PluginAPIHostBridge;
	private pluginContext: PluginContext;

	constructor(opts: PluginAPIBuilderOptions) {
		this.hostBridge = opts.hostBridge;
		this.pluginContext = opts.pluginContext;
	}

	public build(): limbo.API {
		return {
			settings: {
				register: (setting) => {
					this.pluginContext.registerSetting(setting);
				},
				unregister: (settingId) => {
					this.pluginContext.unregisterSetting(settingId);
				},
				get: (settingId) => {
					return this.pluginContext.getCachedSettingValue(settingId);
				},
			},
			models: {
				// operations like this shouldn't ever throw or be expected to by plugin devs
				// still wrapping in case the host bridge does throw (it shouldn't!)
				getLLM: (llmId: string) => {
					try {
						return this.hostBridge.getLLM(llmId);
					} catch {
						throw new Error("Failed to get LLM");
					}
				},
				registerLLM: (llm) => {
					this.pluginContext.registerLLM(llm);
				},
				unregisterLLM: (llmId) => {
					this.pluginContext.unregisterLLM(llmId);
				},
			},
			notifications: {
				show: (notification) => {
					try {
						this.hostBridge.showNotification(notification);
					} catch {
						throw new Error("Failed to show notification");
					}
				},
			},
			tools: {
				register: (tool) => {
					this.pluginContext.registerTool(tool);
				},
				unregister: (toolId) => {
					this.pluginContext.unregisterTool(toolId);
				},
			},
			chats: {
				get: async (args) => {
					try {
						return await this.hostBridge.getChat(args);
					} catch {
						throw new Error("Failed to get chat");
					}
				},
				rename: async (chatId, newName) => {
					try {
						return await this.hostBridge.renameChat(chatId, newName);
					} catch {
						throw new Error("Failed to rename chat");
					}
				},
				getMessages: async (args) => {
					try {
						return await this.hostBridge.getChatMessages(args);
					} catch {
						throw new Error("Failed to get chat messages");
					}
				},
			},
		};
	}
}
