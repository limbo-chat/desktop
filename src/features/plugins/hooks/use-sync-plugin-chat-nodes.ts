import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { useChatNodeStore } from "../../chat-nodes/stores";
import { usePluginManager } from "./core";

export const useSyncPluginChatNodes = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const chatNodeStore = useChatNodeStore.getState();
		const addedChatNodeIds = new Set<string>();

		const syncChatNodes = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const chatNodes = plugin.context.getChatNodes();

				for (const chatNode of chatNodes) {
					const namespacedChatNodeId = buildNamespacedResourceId(
						plugin.manifest.id,
						chatNode.id
					);

					addedChatNodeIds.add(namespacedChatNodeId);

					chatNodeStore.addChatNode({
						...chatNode,
						id: namespacedChatNodeId,
					});
				}
			}
		};

		const removeRegistedChatNodes = () => {
			for (const addedChatNodeId of addedChatNodeIds) {
				chatNodeStore.removeChatNode(addedChatNodeId);
			}

			addedChatNodeIds.clear();
		};

		const handleChange = () => {
			removeRegistedChatNodes();
			syncChatNodes();
		};

		// initial sync
		syncChatNodes();

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
