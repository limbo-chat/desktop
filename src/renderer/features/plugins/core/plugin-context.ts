import type * as limbo from "@limbo-chat/api";
import EventEmitter from "eventemitter3";

export interface PluginContextEvents {
	"setting:registered": (setting: limbo.Setting) => void;
	"setting:unregistered": (settingId: string) => void;
	"command:registered": (command: limbo.Command) => void;
	"command:unregistered": (commandId: string) => void;
	"llm:registered": (llm: limbo.LLM) => void;
	"llm:unregistered": (llmId: string) => void;
	"tool:registered": (tool: limbo.Tool) => void;
	"tool:unregistered": (toolId: string) => void;
	"markdown-element:registered": (markdownElement: limbo.ui.MarkdownElement) => void;
	"markdown-element:unregistered": (markdownElementId: string) => void;
	"chat-node:registered": (chatNode: limbo.ui.ChatNode) => void;
	"chat-node:unregistered": (chatNodeId: string) => void;
	"chat-panel:registered": (chatNode: limbo.ui.ChatPanel) => void;
	"chat-panel:unregistered": (chatPanelId: string) => void;
}

export class PluginContext {
	public events: EventEmitter<PluginContextEvents> = new EventEmitter();
	private settingsCache = new Map<string, any>();

	// registered state
	private settings = new Map<string, limbo.Setting>();
	private commands = new Map<string, limbo.Command>();
	private llms = new Map<string, limbo.LLM>();
	private tools = new Map<string, limbo.Tool>();
	private markdownElements = new Map<string, limbo.ui.MarkdownElement>();
	private chatNodes = new Map<string, limbo.ui.ChatNode>();
	private chatPanels = new Map<string, limbo.ui.ChatPanel>();

	public destroy() {
		this.events.removeAllListeners();
	}

	// settings cache

	public setCachedSettingValue(settingId: string, value: any) {
		this.settingsCache.set(settingId, value);
	}

	public getCachedSettingValue(settingId: string) {
		return this.settingsCache.get(settingId);
	}

	public getCachedSettingValues() {
		return Object.fromEntries(this.settingsCache);
	}

	// settings

	public getSetting(settingId: string) {
		return this.settings.get(settingId);
	}

	public getSettings() {
		return [...this.settings.values()];
	}

	public registerSetting(setting: limbo.Setting) {
		this.settings.set(setting.id, setting);

		this.events.emit("setting:registered", setting);
	}

	public unregisterSetting(settingId: string) {
		this.settings.delete(settingId);

		this.events.emit("setting:unregistered", settingId);
	}

	// commands

	public getCommand(commandId: string) {
		return this.settings.get(commandId);
	}

	public getCommands() {
		return [...this.commands.values()];
	}

	public registerCommand(command: limbo.Command) {
		this.commands.set(command.id, command);

		this.events.emit("command:registered", command);
	}

	public unregisterCommand(commandId: string) {
		this.commands.delete(commandId);

		this.events.emit("command:unregistered", commandId);
	}

	// llms

	public getLLM(llmId: string) {
		return this.llms.get(llmId);
	}

	public getLLMs() {
		return [...this.llms.values()];
	}

	public registerLLM(llm: limbo.LLM) {
		this.llms.set(llm.id, llm);

		this.events.emit("llm:registered", llm);
	}

	public unregisterLLM(llmId: string) {
		this.llms.delete(llmId);

		this.events.emit("llm:unregistered", llmId);
	}

	// tools

	public getTool(toolId: string) {
		return this.tools.get(toolId);
	}

	public getTools() {
		return [...this.tools.values()];
	}

	public registerTool(tool: limbo.Tool) {
		this.tools.set(tool.id, tool);

		this.events.emit("tool:registered", tool);
	}

	public unregisterTool(toolId: string) {
		this.tools.delete(toolId);

		this.events.emit("tool:unregistered", toolId);
	}

	// markdown elements

	public getMarkdownElement(elementId: string) {
		return this.markdownElements.get(elementId);
	}

	public getMarkdownElements() {
		return [...this.markdownElements.values()];
	}

	public registerMarkdownElement(markdownElement: limbo.ui.MarkdownElement) {
		this.markdownElements.set(markdownElement.element, markdownElement);

		this.events.emit("markdown-element:registered", markdownElement);
	}

	public unregisterMarkdownElement(elementId: string) {
		this.markdownElements.delete(elementId);

		this.events.emit("markdown-element:unregistered", elementId);
	}

	// chat nodes

	public getChatNode(chatNodeId: string) {
		return this.chatNodes.get(chatNodeId);
	}

	public getChatNodes() {
		return [...this.chatNodes.values()];
	}

	public registerChatNode(chatNode: limbo.ui.ChatNode) {
		this.chatNodes.set(chatNode.id, chatNode);

		this.events.emit("chat-node:registered", chatNode);
	}

	public unregisterChatNode(chatNodeid: string) {
		this.chatNodes.delete(chatNodeid);

		this.events.emit("chat-node:unregistered", chatNodeid);
	}

	// chat panels

	public getChatPanel(chatPanelId: string) {
		return this.chatPanels.get(chatPanelId);
	}

	public getChatPanels() {
		return [...this.chatPanels.values()];
	}

	public registerChatPanel(chatPanel: limbo.ui.ChatPanel) {
		this.chatPanels.set(chatPanel.id, chatPanel);

		this.events.emit("chat-panel:registered", chatPanel);
	}

	public unregisterChatPanel(chatPanelId: string) {
		this.chatPanels.delete(chatPanelId);

		this.events.emit("chat-panel:unregistered", chatPanelId);
	}
}
