import { shell, type BrowserWindow } from "electron";

export function applyDefaultWindowOptions(window: BrowserWindow) {
	window.on("focus", () => {
		window.webContents.send("focus");
	});

	window.on("blur", () => {
		window.webContents.send("blur");
	});

	window.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);

		return { action: "deny" };
	});
}
