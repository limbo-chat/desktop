import { app, BrowserWindow } from "electron";
import path from "node:path";
import { createIPCHandler } from "trpc-electron/main";
import { mainRouter } from "./router";
import { RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC } from "./constants";

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	});

	createIPCHandler({ router: mainRouter, windows: [win] });

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
