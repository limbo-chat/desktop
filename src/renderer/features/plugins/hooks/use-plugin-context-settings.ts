import { useEffect, useState } from "react";
import type * as limbo from "@limbo/api";
import type { PluginContext } from "../core/plugin-context";

export const usePluginContextSettings = (pluginContext: PluginContext) => {
	const [pluginSettings, setPluginSettings] = useState<limbo.Setting[]>([]);

	useEffect(() => {
		setPluginSettings(pluginContext.getSettings());

		const handleChange = () => {
			setPluginSettings(pluginContext.getSettings());
		};

		pluginContext.events.on("state:changed", handleChange);

		return () => {
			pluginContext.events.off("state:changed", handleChange);
		};
	}, [pluginContext]);

	return pluginSettings;
};
