import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type * as PluginAPI from "limbo";

export interface PluginElementStoreSetting extends PluginAPI.Setting {
	pluginId: string;
}

export interface PluginElementStoreLLM extends PluginAPI.LLM {
	pluginId: string;
}

export interface PluginElementStoreToolbarToggle extends PluginAPI.ToolbarToggle {
	pluginId: string;
}

export interface PluginElementStore {
	settings: PluginElementStoreSetting[];
	llms: PluginElementStoreLLM[];
	toolbarToggles: PluginElementStoreToolbarToggle[];
	removePluginElements(pluginId: string): void;
	addSetting(setting: PluginElementStoreSetting): void;
	removeSetting(pluginId: string, settingId: string): void;
	addLLM(llm: PluginElementStoreLLM): void;
	removeLLM(pluginId: string, llmId: string): void;
	addToolbarToggle(toolbarToggle: PluginElementStoreToolbarToggle): void;
	removeToolbarToggle(pluginId: string, toolbarToggleId: string): void;
}

export const usePluginElementStore = create(
	immer<PluginElementStore>((set) => ({
		settings: [],
		llms: [],
		toolbarToggles: [],
		removePluginElements: (pluginId) => {
			set((state) => {
				state.settings = state.settings.filter((setting) => setting.pluginId !== pluginId);

				state.llms = state.llms.filter((llm) => llm.pluginId !== pluginId);

				state.toolbarToggles = state.toolbarToggles.filter(
					(toolbarToggle) => toolbarToggle.pluginId !== pluginId
				);
			});
		},
		addSetting(setting) {
			set((state) => {
				state.settings.push(setting);
			});
		},
		removeSetting(settingId) {
			set((state) => {
				state.settings = state.settings.filter((setting) => setting.id !== settingId);
			});
		},
		addLLM(llm) {
			set((state) => {
				state.llms.push(llm);
			});
		},
		removeLLM(llmId) {
			set((state) => {
				state.llms = state.llms.filter((llm) => llm.id !== llmId);
			});
		},
		addToolbarToggle(toolbarToggle) {
			set((state) => {
				state.toolbarToggles.push(toolbarToggle);
			});
		},
		removeToolbarToggle(toolbarToggleId) {
			set((state) => {
				state.toolbarToggles = state.toolbarToggles.filter(
					(toolbarToggle) => toolbarToggle.id !== toolbarToggleId
				);
			});
		},
	}))
);
