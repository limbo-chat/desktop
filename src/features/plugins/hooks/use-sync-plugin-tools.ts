import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { addTool, removeTool } from "../../tools/utils";
import { usePluginManager } from "./core";

export const useSyncPluginTools = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const addedToolIds = new Set<string>();

		const syncTools = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const tools = plugin.context.getTools();

				for (const tool of tools) {
					const namespacedToolId = buildNamespacedResourceId(plugin.manifest.id, tool.id);

					addedToolIds.add(namespacedToolId);

					addTool({
						...tool,
						id: namespacedToolId,
					});
				}
			}
		};

		const removeRegistedTools = () => {
			for (const addedToolId of addedToolIds) {
				removeTool(addedToolId);
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
