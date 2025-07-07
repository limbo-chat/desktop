import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { useChatPanelStore } from "../../chat-panels/stores";
import { usePluginManager } from "./core";

export const useSyncPluginChatPanels = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const chatPanelStore = useChatPanelStore.getState();
		const addedChatPanelIds = new Set<string>();

		const syncChatPanels = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const chatPanels = plugin.context.getChatPanels();

				for (const chatPanel of chatPanels) {
					const namespacedChatPanelId = buildNamespacedResourceId(
						plugin.manifest.id,
						chatPanel.id
					);

					addedChatPanelIds.add(namespacedChatPanelId);

					chatPanelStore.addChatPanel(namespacedChatPanelId, {
						...chatPanel,
						id: namespacedChatPanelId,
					});
				}
			}
		};

		const removeRegistedChatPanels = () => {
			for (const addedChatPanelId of addedChatPanelIds) {
				chatPanelStore.removeChatPanel(addedChatPanelId);
			}

			addedChatPanelIds.clear();
		};

		const handleChange = () => {
			removeRegistedChatPanels();
			syncChatPanels();
		};

		// initial sync
		syncChatPanels();

		pluginManager.events.on("plugin:added", handleChange);
		pluginManager.events.on("plugin:removed", handleChange);
		pluginManager.events.on("plugin:state-changed", handleChange);

		return () => {
			pluginManager.events.off("plugin:added", handleChange);
			pluginManager.events.off("plugin:removed", handleChange);
			pluginManager.events.off("plugin:state-changed", handleChange);
		};
	}, []);
};
