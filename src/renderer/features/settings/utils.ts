import { showModal } from "../modals/utils";
import { SettingsTabs } from "./components/settings-tabs";

export function showSettingsModal() {
	showModal({
		id: "settings",
		component: SettingsTabs,
	});
}
