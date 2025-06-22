import { app, BrowserWindow, ipcMain } from "electron";
import { createIPCHandler } from "trpc-electron/main";
import { CustomStylesWatcher } from "./custom-styles/watcher";
import { LATEST_DATA_VERSION } from "./data/constants";
import { ensureData, migrateToLatestVersion } from "./data/utils";
import { readMeta, writeMeta } from "./meta/utils";
import { readSettings } from "./settings/utils";
import { mainRouter } from "./trpc/router";
import { WindowManager } from "./windows/manager";

const windowManager = new WindowManager();

const trpcIpcHandler = createIPCHandler({
	router: mainRouter,
});

function manageWindowIpc(window: BrowserWindow) {
	trpcIpcHandler.attachWindow(window);

	window.on("close", () => {
		trpcIpcHandler.detachWindow(window);
	});
}

function watchCustomStyles() {
	const customStylesWatcher = new CustomStylesWatcher();

	customStylesWatcher.events.on("add", (filePath) => {
		const mainWindow = windowManager.getMainWindow();

		if (mainWindow) {
			mainWindow.webContents.send("custom-style:add", filePath);
		}
	});

	customStylesWatcher.events.on("change", (filePath) => {
		const mainWindow = windowManager.getMainWindow();

		if (mainWindow) {
			mainWindow.webContents.send("custom-style:reload", filePath);
		}
	});

	customStylesWatcher.events.on("remove", (filePath) => {
		const mainWindow = windowManager.getMainWindow();

		if (mainWindow) {
			mainWindow.webContents.send("custom-style:remove", filePath);
		}
	});

	customStylesWatcher.start();
}

function launchWindow() {
	// currently, we only have one window type, the main window
	const newMainWindow = windowManager.createMainWindow();

	manageWindowIpc(newMainWindow);
}

async function startApp() {
	// ensure the required data sources are as expected
	await ensureData();

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

	// read the settings before creating the window
	const settings = readSettings();

	if (settings.isDeveloperModeEnabled) {
		watchCustomStyles();
	}

	// the renderer has a loading process that will send a "ready" event when it is ready to show
	ipcMain.on("renderer:ready", (e) => {
		const mainWindow = windowManager.getMainWindow();

		if (!mainWindow) {
			return;
		}

		if (e.sender.id === mainWindow.webContents.id) {
			mainWindow.show();
		}
	});

	// launch a window
	launchWindow();
}

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
