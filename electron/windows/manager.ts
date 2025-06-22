import { BrowserWindow } from "electron";
import { HTML_PATH, ICON_PATH, PRELOAD_DIST, VITE_DEV_SERVER_URL } from "../constants";
import { readSettings } from "../settings/utils";
import { manageWindowState, readWindowState } from "../window-state/utils";
import { applyDefaultWindowOptions } from "./utils";

export class WindowManager {
	private mainWindow: Electron.BrowserWindow | null = null;

	public getMainWindow() {
		return this.mainWindow;
	}

	public createMainWindow() {
		const settings = readSettings();
		const windowState = readWindowState();

		console.log("Creating main window with state:", windowState);

		this.mainWindow = new BrowserWindow({
			icon: ICON_PATH,
			titleBarStyle: "hidden",
			minHeight: 200,
			minWidth: 300,
			x: windowState?.x ?? undefined,
			y: windowState?.y ?? undefined,
			height: windowState?.height ?? 600,
			width: windowState?.width ?? 800,
			transparent: settings.isTransparencyEnabled,
			// expose window controls in Windows/Linux
			...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
			webPreferences: {
				preload: PRELOAD_DIST,
			},
		});

		this.mainWindow.on("close", () => {
			this.mainWindow = null;
		});

		applyDefaultWindowOptions(this.mainWindow);

		// we want to track the state of the main window
		manageWindowState(this.mainWindow);

		if (VITE_DEV_SERVER_URL) {
			this.mainWindow.loadURL(VITE_DEV_SERVER_URL);
		} else {
			this.mainWindow.loadFile(HTML_PATH);
		}

		return this.mainWindow;
	}
}
