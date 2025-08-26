import { useEffect } from "react";
import type * as limbo from "@limbo/api";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { addLLM, removeLLM } from "../../llms/utils";
import { usePluginManager } from "./core";

export const useSyncPluginLLMs = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const handleLLMRegistered = (pluginId: string, llm: limbo.LLM) => {
			const namespacedLLMId = buildNamespacedResourceId(pluginId, llm.id);

			addLLM({
				...llm,
				id: namespacedLLMId,
			});
		};

		const handleLLMUnregistered = (pluginId: string, llmId: string) => {
			const namespacedLLMId = buildNamespacedResourceId(pluginId, llmId);

			removeLLM(namespacedLLMId);
		};

		pluginManager.events.on("plugin:llm-registered", handleLLMRegistered);
		pluginManager.events.on("plugin:llm-unregistered", handleLLMUnregistered);

		return () => {
			pluginManager.events.off("plugin:llm-registered", handleLLMRegistered);
			pluginManager.events.off("plugin:llm-unregistered", handleLLMUnregistered);
		};
	}, []);
};
