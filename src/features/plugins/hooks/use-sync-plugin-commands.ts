import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { useCommandStore } from "../../commands/stores";
import { usePluginManager } from "./core";

export const useSyncPluginCommands = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const commandStore = useCommandStore.getState();
		const addedCommandIds = new Set<string>();

		const syncCommands = () => {
			const plugins = pluginManager.getPlugins();

			for (const plugin of plugins) {
				const commands = plugin.context.getCommands();

				for (const command of commands) {
					const namespacedCommandId = buildNamespacedResourceId(
						plugin.manifest.id,
						command.id
					);

					addedCommandIds.add(namespacedCommandId);

					commandStore.addCommand({
						...command,
						id: namespacedCommandId,
					});
				}
			}
		};

		const removeRegistedCommands = () => {
			for (const addedCommandId of addedCommandIds) {
				commandStore.removeCommand(addedCommandId);
			}

			addedCommandIds.clear();
		};

		const handleChange = () => {
			removeRegistedCommands();
			syncCommands();
		};

		// initial sync
		syncCommands();

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
