import EventEmitter from "eventemitter3";
import type * as limbo from "limbo";

export interface PluginContextEvents {
	"state:changed": () => void;
}

export class PluginContext {
	public events: EventEmitter<PluginContextEvents> = new EventEmitter();

	// registered state
	private settings = new Map<string, limbo.Setting>();
	private commands = new Map<string, limbo.Command>();
	private llms = new Map<string, limbo.LLM>();
	private tools = new Map<string, limbo.Tool>();
	private markdownElements = new Map<string, limbo.ui.MarkdownElement>();

	private settingsCache = new Map<string, any>();

	public destroy() {
		this.events.removeAllListeners();
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

		this.notifyStateChanged();
	}

	public unregisterSetting(settingId: string) {
		this.settings.delete(settingId);

		this.notifyStateChanged();
	}

	public setCachedSettingValue(settingId: string, value: any) {
		this.settingsCache.set(settingId, value);
	}

	public getCachedSettingValue(settingId: string) {
		return this.settingsCache.get(settingId);
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

		this.notifyStateChanged();
	}

	public unregisterCommand(commandId: string) {
		this.commands.delete(commandId);

		this.notifyStateChanged();
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

		this.notifyStateChanged();
	}

	public unregisterLLM(llmId: string) {
		this.llms.delete(llmId);

		this.notifyStateChanged();
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

		this.notifyStateChanged();
	}

	public unregisterTool(toolId: string) {
		this.tools.delete(toolId);

		this.notifyStateChanged();
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

		this.notifyStateChanged();
	}

	public unregisterMarkdownElement(elementId: string) {
		this.markdownElements.delete(elementId);

		this.notifyStateChanged();
	}

	// helpers

	private notifyStateChanged() {
		this.events.emit("state:changed");
	}
}
