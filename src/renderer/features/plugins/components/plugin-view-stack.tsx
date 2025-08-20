import { ViewStack } from "../../view-stack/components";
import { PluginSettingsView } from "./views/plugin-settings";
import { PluginsView } from "./views/view-plugins";

const pluginViews = {
	"view-plugins": PluginsView,
	"plugin-settings": PluginSettingsView,
} as const;

export const PluginViewStack = () => {
	return <ViewStack defaultView={{ id: "view-plugins", data: null }} views={pluginViews} />;
};
