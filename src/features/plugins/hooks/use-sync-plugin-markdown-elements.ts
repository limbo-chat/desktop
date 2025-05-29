import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { addMarkdownElement, removeMarkdownElement } from "../utils";
import { usePluginManager } from "./core";

export const useSyncPluginMarkdownElements = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const addedElementIds = new Set<string>();

		const syncMarkdownElements = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const markdownElements = plugin.context.getMarkdownElements();

				for (const markdownElement of markdownElements) {
					const namespacedElementId = buildNamespacedResourceId(
						plugin.manifest.id,
						markdownElement.element
					);

					addMarkdownElement(namespacedElementId, markdownElement);

					addedElementIds.add(namespacedElementId);
				}
			}
		};

		const removeRegistedElements = () => {
			for (const addedElementId of addedElementIds) {
				removeMarkdownElement(addedElementId);
			}

			addedElementIds.clear();
		};

		const handleChange = () => {
			removeRegistedElements();
			syncMarkdownElements();
		};

		// initial sync
		syncMarkdownElements();

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
