import { replaceModals, showModal } from "../modals/utils";
import { SettingsTabs } from "./components/settings-tabs";

export function showSettingsModal() {
	replaceModals({
		id: "settings",
		component: SettingsTabs,
	});
}
