import { useEffect, useState } from "react";

export const useIsAppFocused = () => {
	const [isAppFocused, setIsAppFocused] = useState(true);

	useEffect(() => {
		const focusHandler = () => {
			setIsAppFocused(true);
		};

		const blurHandler = () => {
			setIsAppFocused(false);
		};

		window.ipcRenderer.on("focus", focusHandler);
		window.ipcRenderer.on("blur", blurHandler);

		return () => {
			window.ipcRenderer.off("focus", focusHandler);
			window.ipcRenderer.off("blur", blurHandler);
		};
	});

	return isAppFocused;
};
