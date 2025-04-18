import { usePluginHotReloader, usePluginLoader } from "../hooks";

export const PluginController = () => {
	// load the plugins
	usePluginLoader();

	// setup hot reloading for plugins
	usePluginHotReloader();

	return null;
};
