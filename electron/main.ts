import { app, shell, BrowserWindow } from "electron";
import path from "node:path";
import { createIPCHandler } from "trpc-electron/main";
import { mainRouter } from "./router";
import { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC } from "./constants";
import { createServer } from "./server";
import getPort from "get-port";

function createWindow() {
	const window = new BrowserWindow({
		icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(MAIN_DIST, "preload.mjs"),
		},
	});

	// open links externally
	window.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);

		return { action: "deny" };
	});

	if (VITE_DEV_SERVER_URL) {
		window.loadURL(VITE_DEV_SERVER_URL);
	} else {
		window.loadFile(path.join(RENDERER_DIST, "index.html"));
	}

	return window;
}

app.whenReady().then(async () => {
	const window = createWindow();

	createIPCHandler({
		router: mainRouter,
		windows: [window],
		createContext: async () => {
			return {
				win: window,
			};
		},
	});

	const server = createServer(window);

	// this will try getting port 5151 first, if it's occupied it will find a free port and start the server on it
	const port = await getPort({
		port: 5151,
	});

	server.listen(port);
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
