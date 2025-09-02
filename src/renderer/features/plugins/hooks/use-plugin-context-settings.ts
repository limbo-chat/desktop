import { useEffect, useState } from "react";
import type * as limbo from "@limbo-chat/api";
import type { PluginContext } from "../core/plugin-context";

export const usePluginContextSettings = (pluginContext: PluginContext) => {
	const [pluginSettings, setPluginSettings] = useState<limbo.Setting[]>([]);

	useEffect(() => {
		setPluginSettings(pluginContext.getSettings());

		const handleChange = () => {
			setPluginSettings(pluginContext.getSettings());
		};

		pluginContext.events.on("setting:registered", handleChange);
		pluginContext.events.on("setting:unregistered", handleChange);

		return () => {
			pluginContext.events.off("setting:registered", handleChange);
			pluginContext.events.off("setting:unregistered", handleChange);
		};
	}, [pluginContext]);

	return pluginSettings;
};
