import { useSyncPluginChatNodes } from "./use-sync-plugin-chat-nodes";
import { useSyncPluginChatPanels } from "./use-sync-plugin-chat-panels";
import { useSyncPluginCommands } from "./use-sync-plugin-commands copy";
import { useSyncPluginLLMs } from "./use-sync-plugin-llms";
import { useSyncPluginMarkdownElements } from "./use-sync-plugin-markdown-elements";
import { useSyncPluginTools } from "./use-sync-plugin-tools";

export const usePluginSyncLayer = () => {
	useSyncPluginMarkdownElements();
	useSyncPluginChatNodes();
	useSyncPluginCommands();
	useSyncPluginLLMs();
	useSyncPluginTools();
	useSyncPluginChatPanels();
};
