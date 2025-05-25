import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { useLLMStore } from "../../llms/stores";
import { usePluginManager } from "./core";

export const useSyncPluginLLMs = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const llmStore = useLLMStore.getState();
		const addedLLMIds = new Set<string>();

		const syncLLMs = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const tools = plugin.context.getLLMs();

				for (const tool of tools) {
					const namespacedToolId = buildNamespacedResourceId(plugin.manifest.id, tool.id);

					addedLLMIds.add(namespacedToolId);

					llmStore.addLLM({
						...tool,
						id: namespacedToolId,
					});
				}
			}
		};

		const removeRegistedLLMs = () => {
			for (const addedToolId of addedLLMIds) {
				llmStore.removeLLM(addedToolId);
			}

			addedLLMIds.clear();
		};

		const handleChange = () => {
			removeRegistedLLMs();
			syncLLMs();
		};

		// initial sync
		syncLLMs();

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
