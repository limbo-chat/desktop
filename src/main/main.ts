import { app, BrowserWindow, ipcMain } from "electron";
import { createIPCHandler } from "trpc-electron/main";
import { PROTOCOL } from "./constants";
import { ensureCustomStylesDirectory } from "./custom-styles/utils";
import { CustomStylesWatcher } from "./custom-styles/watcher";
import type { AppDatabaseClient } from "./db/types";
import { getDb } from "./db/utils";
import { handleDeepLink } from "./deep-linking/utils";
import { ensurePluginsDir } from "./plugins/utils";
import { getAllPreferences, getPreference } from "./preferences/utils";
import { mainRouter } from "./trpc/router";
import { getWindowState, manageWindowState } from "./window-state/utils";
import { WindowManager } from "./windows/manager";
import type { WindowType } from "./windows/types";

const windowManager = new WindowManager();

const trpcIpcHandler = createIPCHandler({
	router: mainRouter,
	createContext: async ({ event }) => {
		return {
			event,
			windowManager,
		};
	},
});

export async function ensureDirectories() {
	await Promise.all([ensurePluginsDir(), ensureCustomStylesDirectory()]);
}

function watchCustomStyles() {
	const customStylesWatcher = new CustomStylesWatcher();

	customStylesWatcher.events.on("add", (filePath) => {
		windowManager.sendMessageToAllWindows("custom-style:add", filePath);
	});

	customStylesWatcher.events.on("change", (filePath) => {
		windowManager.sendMessageToAllWindows("custom-style:reload", filePath);
	});

	customStylesWatcher.events.on("remove", (filePath) => {
		windowManager.sendMessageToAllWindows("custom-style:remove", filePath);
	});

	customStylesWatcher.start();
}

async function launchWindow(db: AppDatabaseClient) {
	const transparentPref = await getPreference(db, "transparent");
	const windowState = await getWindowState(db);

	const mainWindow = windowManager.createMainWindow({
		transparent: transparentPref === "true",
		x: windowState?.x,
		y: windowState?.y,
		height: windowState?.height,
		width: windowState?.width,
	});

	// we want to track the state of the main window
	manageWindowState(db, mainWindow);
}

async function startApp() {
	// ensure the required data sources are as expected
	await ensureDirectories();

	const db = await getDb();

	const developerModeEnabledPref = await getPreference(db, "developer-mode:enabled");

	// read the settings before creating the window
	if (developerModeEnabledPref === "true") {
		watchCustomStyles();
	}

	// the windows have a loading process that will send a "ready" event when it is ready to show
	ipcMain.on("window:ready", (_, windowId: WindowType) => {
		const readyWindow = windowManager.getWindow(windowId);

		if (!readyWindow) {
			return;
		}

		readyWindow.show();
	});

	// launch a window
	launchWindow(db);
}

windowManager.events.on("window:created", (windowId) => {
	const window = windowManager.getWindow(windowId);

	if (!window) {
		return;
	}

	trpcIpcHandler.attachWindow(window);

	window.on("close", () => {
		trpcIpcHandler.detachWindow(window);
	});
});

app.setAsDefaultProtocolClient(PROTOCOL);

// quit when all windows are closed, except on macos.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", async () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		const db = await getDb();

		// recreate a window if there are no windows open
		launchWindow(db);
	}
});

// this is used to handle custom protocol links on macos
app.on("open-url", async (event, url) => {
	await handleDeepLink(url, windowManager);
});

// start the app when electron is ready
app.whenReady().then(startApp);
