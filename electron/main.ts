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

interface CreateWindowOptions {
	transparent: boolean;
}

function createWindow(opts: CreateWindowOptions) {
	const window = new BrowserWindow({
		titleBarStyle: "hidden",
		transparent: opts.transparent,
		icon: ICON_PATH,
		// expose window controls in Windows/Linux
		...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
		webPreferences: {
			preload: PRELOAD_DIST,
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
		window.loadFile(HTML_PATH);
	}

	return window;
}

async function ensureData() {
	await Promise.all([
		ensureSettings(),
		ensurePluginsDir(),
		ensureCustomStylesDirectory(),
		ensureDb(),
	]);
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

	await ensureData();

	// read the settings before creating the window
	const settings = readSettings();

	// create the main window
	const mainWindow = createWindow({
		transparent: settings.isTransparencyEnabled,
	});

	// the renderer has a loading process that will send a "ready" event when it is ready to show
	ipcMain.on("renderer:ready", () => {
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

	// custom styles wathcing should only be enabled in developer mode
	if (settings.isDeveloperModeEnabled) {
		const customStylesWatcher = new CustomStylesWatcher({
			window: mainWindow,
		});

		customStylesWatcher.start();
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

		createWindow({ transparent: settings.isTransparencyEnabled });
	}
});
