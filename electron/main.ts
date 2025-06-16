import { app, shell, BrowserWindow, ipcMain } from "electron";
import { createIPCHandler } from "trpc-electron/main";
import { HTML_PATH, ICON_PATH, PRELOAD_DIST, VITE_DEV_SERVER_URL } from "./constants";
import { ensureCustomStylesDirectory } from "./custom-styles/utils";
import { CustomStylesWatcher } from "./custom-styles/watcher";
import { ensureDb } from "./db/utils";
import { defaultMeta, readMeta, writeMeta } from "./meta/utils";
import { LATEST_DATA_VERSION } from "./migrations/constants";
import { migrateToLatestVersion } from "./migrations/utils";
import { ensurePluginsDir } from "./plugins/utils";
import { ensureSettings, readSettings } from "./settings/utils";
import { mainRouter } from "./trpc/router";

let mainWindow: BrowserWindow | null = null;

interface CreateWindowOptions {
	transparent: boolean;
}

const trpcIpcHandler = createIPCHandler({
	router: mainRouter,
});

function createMainWindow(opts: CreateWindowOptions) {
	const newMainWindow = new BrowserWindow({
		titleBarStyle: "hidden",
		transparent: opts.transparent,
		icon: ICON_PATH,
		// expose window controls in Windows/Linux
		...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
		webPreferences: {
			preload: PRELOAD_DIST,
		},
	});

	const newMainWindowId = newMainWindow.webContents.id;

	// attach the IPC handler to the new window
	trpcIpcHandler.attachWindow(newMainWindow);

	// open links externally
	newMainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);

		return { action: "deny" };
	});

	newMainWindow.on("focus", () => {
		newMainWindow.webContents.send("focus");
	});

	newMainWindow.on("blur", () => {
		newMainWindow.webContents.send("blur");
	});

	newMainWindow.on("closed", () => {
		trpcIpcHandler.detachWindow(newMainWindow, newMainWindowId);

		mainWindow = null;
	});

	if (VITE_DEV_SERVER_URL) {
		newMainWindow.loadURL(VITE_DEV_SERVER_URL);
	} else {
		newMainWindow.loadFile(HTML_PATH);
	}

	mainWindow = newMainWindow;
}

async function ensureData() {
	await Promise.all([
		ensureSettings(),
		ensurePluginsDir(),
		ensureCustomStylesDirectory(),
		ensureDb(),
	]);
}

function watchCustomStyles() {
	const customStylesWatcher = new CustomStylesWatcher();

	customStylesWatcher.events.on("add", (filePath) => {
		if (mainWindow) {
			mainWindow.webContents.send("custom-style:add", filePath);
		}
	});

	customStylesWatcher.events.on("change", (filePath) => {
		if (mainWindow) {
			mainWindow.webContents.send("custom-style:reload", filePath);
		}
	});

	customStylesWatcher.events.on("remove", (filePath) => {
		if (mainWindow) {
			mainWindow.webContents.send("custom-style:remove", filePath);
		}
	});

	customStylesWatcher.start();
}

async function startApp() {
	let meta = readMeta();

	if (!meta) {
		// fresh install
		meta = defaultMeta;

		writeMeta(defaultMeta);
	}

	// check if the user's data version is behind the latest version
	if (meta.dataVersion < LATEST_DATA_VERSION) {
		// if so, run migrations to bring it up to date
		await migrateToLatestVersion(meta.dataVersion);

		meta = {
			...meta,
			dataVersion: LATEST_DATA_VERSION,
		};

		// update the meta file with the latest data version
		writeMeta(meta);
	}

	// ensure the required data sources are as expected
	await ensureData();

	// read the settings before creating the window
	const settings = readSettings();

	// create the main window on startup
	createMainWindow({
		transparent: settings.isTransparencyEnabled,
	});

	// the renderer has a loading process that will send a "ready" event when it is ready to show
	ipcMain.on("renderer:ready", (e) => {
		if (!mainWindow) {
			return;
		}

		if (e.sender.id === mainWindow.webContents.id) {
			mainWindow.show();
		}
	});

	if (settings.isDeveloperModeEnabled) {
		console.log("Developer mode is enabled.");

		watchCustomStyles();
	}
}

app.whenReady().then(startApp);

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
		const settings = readSettings();

		createMainWindow({ transparent: settings.isTransparencyEnabled });
	}
});
