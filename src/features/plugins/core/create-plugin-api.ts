import type * as limbo from "limbo";
import type { PluginContext } from "./plugin-context";

export interface PluginAPIHostBridge {
	getLLM: limbo.API["models"]["getLLM"];
	showNotification: limbo.API["notifications"]["show"];
	renameChat: limbo.API["chats"]["rename"];
	getChat: limbo.API["chats"]["get"];
	getChatMessages: limbo.API["chats"]["getMessages"];
}

export interface CreatePluginAPIOptions {
	hostBridge: PluginAPIHostBridge;
	pluginContext: PluginContext;
}

export function createPluginAPI({ hostBridge, pluginContext }: CreatePluginAPIOptions): limbo.API {
	return {
		settings: {
			register: (setting) => {
				pluginContext.registerSetting(setting);
			},
			unregister: (settingId) => {
				pluginContext.unregisterSetting(settingId);
			},
			get: (settingId) => {
				return pluginContext.getCachedSettingValue(settingId);
			},
		},
		commands: {
			register: (command) => {
				pluginContext.registerCommand(command);
			},
			unregister: (commandId) => {
				pluginContext.unregisterCommand(commandId);
			},
		},
		models: {
			// operations like this shouldn't ever throw or be expected to by plugin devs
			// still wrapping in case the host bridge does throw (it shouldn't!)
			getLLM: (llmId: string) => {
				try {
					return hostBridge.getLLM(llmId);
				} catch {
					throw new Error("Failed to get LLM");
				}
			},
			registerLLM: (llm) => {
				pluginContext.registerLLM(llm);
			},
			unregisterLLM: (llmId) => {
				pluginContext.unregisterLLM(llmId);
			},
		},
		notifications: {
			show: (notification) => {
				try {
					hostBridge.showNotification(notification);
				} catch {
					throw new Error("Failed to show notification");
				}
			},
		},
		tools: {
			register: (tool) => {
				pluginContext.registerTool(tool);
			},
			unregister: (toolId) => {
				pluginContext.unregisterTool(toolId);
			},
		},
		chats: {
			get: async (args) => {
				try {
					return await hostBridge.getChat(args);
				} catch {
					throw new Error("Failed to get chat");
				}
			},
			rename: async (chatId, newName) => {
				try {
					return await hostBridge.renameChat(chatId, newName);
				} catch {
					throw new Error("Failed to rename chat");
				}
			},
			getMessages: async (args) => {
				try {
					return await hostBridge.getChatMessages(args);
				} catch {
					throw new Error("Failed to get chat messages");
				}
			},
		},
		ui: {
			registerMarkdownElement: (element) => {
				pluginContext.registerMarkdownElement(element);
			},
			unregisterMarkdownElement: (elementId) => {
				pluginContext.unregisterMarkdownElement(elementId);
			},
			registerChatNode: (node) => {},
			unregisterChatNode: (nodeId) => {},
		},
	};
}
