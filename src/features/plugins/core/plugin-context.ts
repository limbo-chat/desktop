import EventEmitter from "eventemitter3";
import type * as limbo from "limbo";

export interface PluginContextEvents {
	"state:changed": () => void;
}

export interface PluginHostBridge {
	getLLM: limbo.API["models"]["getLLM"];
	showNotification: limbo.API["notifications"]["show"];
	renameChat: limbo.API["chats"]["rename"];
	getChat: limbo.API["chats"]["get"];
	getChatMessages: limbo.API["chats"]["getMessages"];
}

export class PluginContext {
	public events: EventEmitter<PluginContextEvents> = new EventEmitter();

	// registered state
	private settings = new Map<string, limbo.Setting>();
	private llms = new Map<string, limbo.LLM>();
	private tools = new Map<string, limbo.Tool>();

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
	}

	public unregisterSetting(settingId: string) {
		this.settings.delete(settingId);
	}

	public setCachedSettingValue(settingId: string, value: any) {
		this.settingsCache.set(settingId, value);
	}

	public getCachedSettingValue(settingId: string) {
		return this.settingsCache.get(settingId);
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
	}

	public unregisterLLM(llmId: string) {
		this.llms.delete(llmId);
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
	}

	public unregisterTool(toolId: string) {
		this.tools.delete(toolId);
	}
}
