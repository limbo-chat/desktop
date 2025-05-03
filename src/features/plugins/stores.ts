import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PluginManifest } from "../../../electron/plugins/schemas";

export interface PluginStoreData {
	enabled: boolean;
	manifest: PluginManifest;
}

export interface PluginStore {
	plugins: Record<string, PluginStoreData>;
	addPlugin: (pluginId: string, data: PluginStoreData) => void;
	getPlugin: (pluginId: string) => PluginStoreData | undefined;
	updatePlugin: (pluginId: string, data: Partial<PluginStoreData>) => void;
	removePlugin: (pluginId: string) => void;
}

export const usePluginStore = create(
	immer<PluginStore>((set, get) => ({
		plugins: {},
		addPlugin: (id: string, pluginData) => {
			set((state) => {
				state.plugins[id] = pluginData;
			});
		},
		getPlugin: (pluginId: string) => {
			const plugins = get().plugins;

			return plugins[pluginId];
		},
		updatePlugin: (pluginId: string, pluginData) => {
			set((state) => {
				if (state.plugins[pluginId]) {
					state.plugins[pluginId] = {
						...state.plugins[pluginId],
						...pluginData,
					};
				}
			});
		},
		removePlugin: (pluginId: string) => {
			set((state) => {
				delete state.plugins[pluginId];
			});
		},
	}))
);
