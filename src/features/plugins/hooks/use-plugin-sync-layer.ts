import { useSyncPluginCommands } from "./use-sync-plugin-commands";
import { useSyncPluginLLMs } from "./use-sync-plugin-llms";
import { useSyncPluginMarkdownElements } from "./use-sync-plugin-markdown-elements";
import { useSyncPluginTools } from "./use-sync-plugin-tools";

export const usePluginSyncLayer = () => {
	useSyncPluginCommands();
	useSyncPluginLLMs();
	useSyncPluginTools();
	useSyncPluginMarkdownElements();
};
