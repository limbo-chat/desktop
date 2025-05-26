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
				const llms = plugin.context.getLLMs();

				for (const llm of llms) {
					const namespacedLLMId = buildNamespacedResourceId(plugin.manifest.id, llm.id);

					addedLLMIds.add(namespacedLLMId);

					llmStore.addLLM({
						...llm,
						id: namespacedLLMId,
					});
				}
			}
		};

		const removeRegistedLLMs = () => {
			for (const addedLLMId of addedLLMIds) {
				llmStore.removeLLM(addedLLMId);
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
