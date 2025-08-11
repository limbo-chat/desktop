import type * as limbo from "@limbo/api";
import type { PluginContext } from "./plugin-context";
import type { PluginEnvironment } from "./plugin-environment";

export interface CreatePluginAPIOptions {
	pluginId: string;
	pluginContext: PluginContext;
}

export interface PluginAPIFactoryOptions {
	environment: PluginEnvironment;
}

export class PluginAPIFactory {
	private pluginEnvironment: PluginEnvironment;

	constructor(opts: PluginAPIFactoryOptions) {
		this.pluginEnvironment = opts.environment;
	}

	public create({ pluginId, pluginContext }: CreatePluginAPIOptions): limbo.API {
		return {
			storage: {
				// @ts-expect-error
				get: async (key) => {
					try {
						return await this.pluginEnvironment.storage.get({
							pluginId,
							key,
						});
					} catch (err) {
						throw new Error("Failed to get storage value");
					}
				},
				set: async (key, value) => {
					try {
						await this.pluginEnvironment.storage.set({
							pluginId,
							key,
							value,
						});
					} catch (err) {
						throw new Error("Failed to set storage value");
					}
				},
				remove: async (key) => {
					try {
						await this.pluginEnvironment.storage.remove({
							pluginId,
							key,
						});
					} catch (err) {
						throw new Error("Failed to remove storage value");
					}
				},
				clear: async () => {
					try {
						await this.pluginEnvironment.storage.clear({
							pluginId,
						});
					} catch (err) {
						throw new Error("Failed to clear storage");
					}
				},
			},
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
			database: {
				query: async (sql, params) => {
					try {
						return await this.pluginEnvironment.database.query({
							pluginId,
							sql,
							params,
						});
					} catch (err) {
						throw new Error("Failed to execute database query");
					}
				},
			},
			models: {
				getLLM: (llmId: string) => {
					try {
						return this.pluginEnvironment.models.getLLM(llmId);
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
			tools: {
				register: (tool) => {
					pluginContext.registerTool(tool);
				},
				unregister: (toolId) => {
					pluginContext.unregisterTool(toolId);
				},
			},
			chats: {
				get: async (chatId) => {
					try {
						return this.pluginEnvironment.chats.get(chatId);
					} catch {
						throw new Error("Failed to get chat");
					}
				},
				rename: async (chatId, newName) => {
					try {
						return this.pluginEnvironment.chats.rename(chatId, newName);
					} catch {
						throw new Error("Failed to rename chat");
					}
				},
				getMessages: async (args) => {
					try {
						return this.pluginEnvironment.chats.getMessages(args);
					} catch {
						throw new Error("Failed to get chat messages");
					}
				},
			},
			ui: {
				showNotification: (notification) => {
					try {
						this.pluginEnvironment.ui.showNotification({
							pluginId,
							notification,
						});
					} catch {
						throw new Error("Failed to show notification");
					}
				},
				registerMarkdownElement: (element) => {
					pluginContext.registerMarkdownElement(element);
				},
				unregisterMarkdownElement: (elementId) => {
					pluginContext.unregisterMarkdownElement(elementId);
				},
				registerChatNode: (node) => {
					pluginContext.registerChatNode(node);
				},
				unregisterChatNode: (nodeId) => {
					pluginContext.unregisterChatNode(nodeId);
				},
				registerChatPanel: (chatPanel: limbo.ui.ChatPanel<any>) => {
					pluginContext.registerChatPanel(chatPanel);
				},
				unregisterChatPanel: (chatPanelId) => {
					pluginContext.unregisterChatPanel(chatPanelId);
				},
				showChatPanel: (args) => {
					try {
						this.pluginEnvironment.ui.showChatPanel(args);
					} catch {
						throw new Error("Failed to show chat panel");
					}
				},
				showConfirmDialog: async (opts) => {
					try {
						return await this.pluginEnvironment.ui.showConfirmDialog(opts);
					} catch {
						throw new Error("Failed to show confirm dialog");
					}
				},
			},
			auth: {
				authenticate: (opts) => {
					try {
						return this.pluginEnvironment.auth.authenticate({
							pluginId,
							options: opts,
						});
					} catch {
						// note: we are losing the original error here and the other methods here in the factory that catch
						throw new Error("Failed to authenticate");
					}
				},
			},
		};
	}
}
