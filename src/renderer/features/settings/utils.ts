import { showModal } from "../modals/utils";
import { SettingsTabs } from "./components/settings-tabs";

export function showSettingsModal() {
	showModal({
		component: SettingsTabs,
		className: "settings-modal",
	});
}
