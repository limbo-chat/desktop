import { useSyncPluginCommands } from "./use-sync-plugin-commands";
import { useSyncPluginLLMs } from "./use-sync-plugin-llms";
import { useSyncPluginTools } from "./use-sync-plugin-tools";

export const usePluginSyncLayer = () => {
	useSyncPluginCommands();
	useSyncPluginLLMs();
	useSyncPluginTools();
};
