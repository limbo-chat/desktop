import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { useToolStore } from "../../entities/tools/stores";
import { usePluginManager } from "./core";

export const useSyncPluginTools = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const toolStore = useToolStore.getState();
		const addedToolIds = new Set<string>();

		const syncTools = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const tools = plugin.context.getTools();

				for (const tool of tools) {
					const namespacedToolId = buildNamespacedResourceId(plugin.manifest.id, tool.id);

					addedToolIds.add(namespacedToolId);

					toolStore.addTool({
						...tool,
						id: namespacedToolId,
					});
				}
			}
		};

		const removeRegistedTools = () => {
			for (const addedToolId of addedToolIds) {
				toolStore.removeTool(addedToolId);
			}

			addedToolIds.clear();
		};

		const handleChange = () => {
			removeRegistedTools();
			syncTools();
		};

		// initial sync
		syncTools();

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
