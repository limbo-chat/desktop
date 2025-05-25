import { useSyncPluginTools } from "./use-sync-plugin-tools";
import { useSyncPluginLLMs } from "./use-sync-pugin-llms";

export const usePluginSyncLayer = () => {
	useSyncPluginLLMs();
	useSyncPluginTools();
};
