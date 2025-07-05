import { app, BrowserWindow, ipcMain } from "electron";
import { createIPCHandler } from "trpc-electron/main";
import { CustomStylesWatcher } from "./custom-styles/watcher";
import { LATEST_DATA_VERSION } from "./data/constants";
import { ensureData, migrateToLatestVersion } from "./data/utils";
import { readMeta, writeMeta } from "./meta/utils";
import { readSettings } from "./settings/utils";
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

function launchWindow() {
	windowManager.createMainWindow();
}

async function startApp() {
	const meta = readMeta();

	// check if the user's data version is behind the latest version
	if (meta.dataVersion < LATEST_DATA_VERSION) {
		// if so, run migrations to bring it up to date
		await migrateToLatestVersion(meta.dataVersion);

		// update the meta file with the latest data version
		writeMeta({
			...meta,
			dataVersion: LATEST_DATA_VERSION,
		});
	}

	// ensure the required data sources are as expected
	await ensureData();

	// read the settings before creating the window
	const settings = readSettings();

	if (settings.isDeveloperModeEnabled) {
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
	launchWindow();
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

// quit when all windows are closed, except on macos.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		// recreate a window if there are no windows open
		launchWindow();
	}
});

// start the app when electron is ready
app.whenReady().then(startApp);
