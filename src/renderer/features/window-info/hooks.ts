import { useContext, useEffect, useState } from "react";
import type { WindowInfo } from "../../../main/windows/types";
import { windowInfoContext } from "./contexts";

export const useWindowInfoFromIpc = () => {
	const [windowInfo, setWindowInfo] = useState<WindowInfo | null>(null);

	useEffect(() => {
		const onWindowInfo = (_: any, info: WindowInfo) => {
			setWindowInfo(info);
		};

		window.ipcRenderer.on("window:info", onWindowInfo);

		return () => {
			window.ipcRenderer.off("window:info", onWindowInfo);
		};
	}, []);

	return windowInfo;
};

export const useWindowInfoContext = () => {
	const ctx = useContext(windowInfoContext);

	if (!ctx) {
		throw new Error("useWindowInfoContext must be used within a WindowInfoProvider");
	}

	return ctx;
};
