import type * as limbo from "@limbo/api";
import { Type } from "@sinclair/typebox";
import { buildNamespacedResourceId } from "../../../lib/utils";
import type { PluginManager } from "../../plugins/core/plugin-manager";

export function createGetModelsTool(pluginManager: PluginManager): limbo.Tool {
	return {
		id: buildNamespacedResourceId("core", "get_models"),
		schema: Type.Object(
			{},
			{
				additionalProperties: false,
			}
		),
		description: "Get a list of all registered models",
		execute: () => {
			const plugins = pluginManager.getPlugins();
			const llmList = [];

			for (const plugin of plugins) {
				const llms = plugin.context.getLLMs();

				for (const llm of llms) {
					const llmId = buildNamespacedResourceId(plugin.manifest.id, llm.id);

					llmList.push({
						id: llmId,
						name: llm.name,
						description: llm.description,
					});
				}
			}

			// this is as a formatted string, but it could also be JSON. Not sure whats the better approach. LLMS obvioiusly work with text, so either is probably fine.

			const formattedList = llmList.map((llm) => {
				return `ID: ${llm.id}\nName: ${llm.name}\nDescription: ${llm.description}`;
			});

			return formattedList.join("\n\n");
		},
	};
}
