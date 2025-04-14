import { useState } from "react";

export const useIsAppFocused = () => {
	const [isAppFocused, setIsAppFocused] = useState(true);

	window.ipcRenderer.on("focus", () => {
		setIsAppFocused(true);
	});

	window.ipcRenderer.on("blur", () => {
		setIsAppFocused(false);
	});

	return isAppFocused;
};
