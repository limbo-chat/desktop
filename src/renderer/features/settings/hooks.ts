import { useEffect } from "react";
import { showSettingsModal } from "./utils";

export const useSettingsSubscriber = () => {
	useEffect(() => {
		const handler = () => {
			showSettingsModal();
		};

		window.ipcRenderer.on("settings:open", handler);

		return () => {
			window.ipcRenderer.removeListener("settings:open", handler);
		};
	}, []);
};
