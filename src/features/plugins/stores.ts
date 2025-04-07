import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type * as PluginAPI from "limbo";

export interface PluginElementStoreSetting {
	pluginId: string;
	setting: PluginAPI.Setting;
}

export interface PluginElementStoreLLM {
	pluginId: string;
	llm: PluginAPI.LLM; // This is to ensure compatibility with the PluginAPI.LLM interface
}

export interface PluginElementStoreToolbarToggle {
	pluginId: string;
	toolbarToggle: PluginAPI.ToolbarToggle; // This is to ensure compatibility with the PluginAPI.ToolbarToggle interface
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
				state.settings = state.settings.filter((setting) => setting.pluginId !== settingId);
			});
		},
		addLLM(llm) {
			set((state) => {
				state.llms.push(llm);
			});
		},
		removeLLM(llmId) {
			set((state) => {
				state.llms = state.llms.filter((llm) => llm.pluginId !== llmId);
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
					(toolbarToggle) => toolbarToggle.pluginId !== toolbarToggleId
				);
			});
		},
	}))
);
