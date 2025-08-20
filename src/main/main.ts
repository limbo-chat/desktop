import { app, BrowserWindow, ipcMain } from "electron";
import { createIPCHandler } from "trpc-electron/main";
import { PROTOCOL } from "./constants";
import { CustomStylesWatcher } from "./custom-styles/watcher";
import { LATEST_DATA_VERSION } from "./data/constants";
import { ensureData, migrateToLatestVersion } from "./data/utils";
import { getDb } from "./db/utils";
import { handleDeepLink } from "./deep-linking/utils";
import { setValue } from "./kv/utils";
import { getAllPreferences, getPreference } from "./preferences/utils";
import { mainRouter } from "./trpc/router";
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

async function launchWindow(prefs: Record<string, string>) {
	windowManager.createMainWindow({
		transparent: prefs["transparent"] === "true",
	});
}

async function startApp() {
	// ensure the required data sources are as expected
	await ensureData();

	const db = await getDb();

	const dataVersionValue = await getPreference(db, "data_version");
	const currentDataVersion = dataVersionValue ? parseInt(dataVersionValue, 10) : 0;

	// check if the user's data version is behind the latest version
	if (currentDataVersion < LATEST_DATA_VERSION) {
		// if so, run migrations to bring it up to date
		await migrateToLatestVersion(currentDataVersion);

		// update the meta file with the latest data version
		await setValue(db, "data_version", LATEST_DATA_VERSION.toString());
	}

	const prefs = await getAllPreferences(db);

	// read the settings before creating the window
	if (prefs["developer-mode:enabled"] === "true") {
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
	launchWindow(prefs);
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
		const prefs = await getAllPreferences(db);

		// recreate a window if there are no windows open
		launchWindow(prefs);
	}
});

// this is used to handle custom protocol links on macos
app.on("open-url", async (event, url) => {
	await handleDeepLink(url, windowManager);
});

// start the app when electron is ready
app.whenReady().then(startApp);
