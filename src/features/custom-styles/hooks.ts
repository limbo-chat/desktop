import { useEffect } from "react";
import { addCustomStyle, removeCustomStyle } from "./utils";

export const useCustomStylesSubscriber = () => {
	useEffect(() => {
		const onCustomStylesAdd = (_: any, path: string) => {
			addCustomStyle(path);
		};

		const onCustomStylesRemove = (_: any, path: string) => {
			removeCustomStyle(path);
		};

		const onCustomStylesReload = (_: any, path: string) => {
			removeCustomStyle(path);
			addCustomStyle(path);
		};

		window.ipcRenderer.on("custom-style:add", onCustomStylesAdd);
		window.ipcRenderer.on("custom-style:remove", onCustomStylesRemove);
		window.ipcRenderer.on("custom-style:reload", onCustomStylesReload);

		return () => {
			window.ipcRenderer.off("custom-style:add", onCustomStylesAdd);
			window.ipcRenderer.off("custom-style:remove", onCustomStylesRemove);
			window.ipcRenderer.off("custom-style:reload", onCustomStylesReload);
		};
	}, []);
};
