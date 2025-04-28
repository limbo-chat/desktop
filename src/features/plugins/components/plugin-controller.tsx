import { usePluginHotReloader, usePluginLoader } from "../hooks";

export const PluginController = () => {
	usePluginLoader();
	usePluginHotReloader();

	return null;
};
