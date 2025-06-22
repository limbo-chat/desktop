import { create } from "zustand";
import type { PluginManifest } from "../../../main/plugins/schemas";

export interface PluginStoreData {
	enabled: boolean;
	manifest: PluginManifest;
}

export interface PluginStore {
	plugins: Map<string, PluginStoreData>;
	setPlugin: (pluginId: string, data: PluginStoreData) => void;
	getPlugin: (pluginId: string) => PluginStoreData | undefined;
	removePlugin: (pluginId: string) => void;
}

export const usePluginStore = create<PluginStore>((set, get) => ({
	plugins: new Map(),
	getPlugin: (pluginId: string) => {
		const plugins = get().plugins;

		return plugins.get(pluginId);
	},
	setPlugin: (id: string, pluginData) => {
		set((state) => {
			const newMap = new Map(state.plugins);

			newMap.set(id, pluginData);

			return {
				plugins: newMap,
			};
		});
	},
	removePlugin: (pluginId: string) => {
		set((state) => {
			const newMap = new Map(state.plugins);

			newMap.delete(pluginId);

			return {
				plugins: newMap,
			};
		});
	},
}));
