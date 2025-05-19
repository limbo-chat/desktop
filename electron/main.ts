import path from "node:path";
import { app, shell, BrowserWindow, ipcMain } from "electron";
import { createIPCHandler } from "trpc-electron/main";
import { mainRouter } from "./trpc/router";
import { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC } from "./constants";
import { migrateToLatest } from "./db/migrate";
import { readSettings } from "./settings/utils";
import { ensurePluginsDir } from "./plugins/utils";
import { ensureCustomStylesDirectory } from "./custom-styles/utils";
import { CustomStylesWatcher } from "./custom-styles/watcher";
import { PluginWatcher } from "./plugins/watcher";

function createWindow() {
	const window = new BrowserWindow({
		transparent: true,
		show: false,
		titleBarStyle: "hidden",
		icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
		// expose window controls in Windows/Linux
		...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
		webPreferences: {
			preload: path.join(MAIN_DIST, "preload.mjs"),
			// I am considering enabling nodeIntegration in the future so plugins can use Node.js APIs directly.
			// but for now, I will keep it disabled
			// nodeIntegration: true,
			// contextIsolation: true,
		},
	});

	// open links externally
	window.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);

		return { action: "deny" };
	});

	window.on("focus", () => {
		window.webContents.send("focus");
	});

	window.on("blur", () => {
		window.webContents.send("blur");
	});

	if (VITE_DEV_SERVER_URL) {
		window.loadURL(VITE_DEV_SERVER_URL);
	} else {
		window.loadFile(path.join(RENDERER_DIST, "index.html"));
	}

	return window;
}

async function ensureFilesExist() {
	await Promise.all([
		readSettings(),
		ensurePluginsDir(),
		ensureCustomStylesDirectory(),
		migrateToLatest(),
	]);
}

app.whenReady().then(async () => {
	await ensureFilesExist();

	const mainWindow = createWindow();

	// the renderer has a loading process that will send a "ready" event when it is ready to show
	ipcMain.on("renderer:ready", () => {
		console.log("renderer is ready");

		mainWindow.show();
	});

	createIPCHandler({
		router: mainRouter,
		windows: [mainWindow],
		createContext: async () => {
			return {
				win: mainWindow,
			};
		},
	});

	const pluginWatcher = new PluginWatcher({
		window: mainWindow,
	});

	const customStylesWatcher = new CustomStylesWatcher({
		window: mainWindow,
	});

	pluginWatcher.start();
	customStylesWatcher.start();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
