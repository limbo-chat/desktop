import { BrowserWindow } from "electron";
import EventEmitter from "eventemitter3";
import { DEV_SERVER_URL, ICON_PATH, PRELOAD_FILE_PATH, HTML_PATH } from "../constants";
import { readSettings } from "../settings/utils";
import { manageWindowState, readWindowState } from "../window-state/utils";
import { applyDefaultWindowOptions, sendWindowInfo } from "./utils";

export type WindowId = "main" | "onboarding";

export interface WindowManagerEvents {
	"window:created": (windowId: WindowId) => void;
}

export class WindowManager {
	public events = new EventEmitter<WindowManagerEvents>();
	private windows = new Map<WindowId, Electron.BrowserWindow>();

	public getWindow(id: WindowId) {
		return this.windows.get(id);
	}

	public createMainWindow() {
		const settings = readSettings();
		const windowState = readWindowState();

		const mainWindow = new BrowserWindow({
			title: "Limbo",
			icon: ICON_PATH,
			titleBarStyle: "hidden",
			minHeight: 200,
			minWidth: 300,
			show: false,
			x: windowState?.x,
			y: windowState?.y,
			height: windowState?.height ?? 600,
			width: windowState?.width ?? 800,
			transparent: settings.isTransparencyEnabled,
			titleBarOverlay: process.platform !== "darwin",
			webPreferences: {
				preload: PRELOAD_FILE_PATH,
			},
		});

		mainWindow.webContents.on("did-finish-load", () => {
			sendWindowInfo(mainWindow, {
				id: "main",
			});
		});

		mainWindow.on("close", () => {
			this.clearWindow("main");
		});

		applyDefaultWindowOptions(mainWindow);

		// we want to track the state of the main window
		manageWindowState(mainWindow);

		if (DEV_SERVER_URL) {
			mainWindow.loadURL(DEV_SERVER_URL);
		} else {
			mainWindow.loadFile(HTML_PATH);
		}

		this.windows.set("main", mainWindow);

		this.events.emit("window:created", "main");

		return mainWindow;
	}

	public createOnboardingWindow() {
		const onboardingWindow = new BrowserWindow({
			title: "Limbo",
			icon: ICON_PATH,
			width: 600,
			height: 500,
			titleBarStyle: "hidden",
			center: true,
			resizable: false,
			maximizable: false,
			show: false,
			titleBarOverlay: process.platform !== "darwin",
			webPreferences: {
				preload: PRELOAD_FILE_PATH,
			},
		});

		onboardingWindow.webContents.on("did-finish-load", () => {
			sendWindowInfo(onboardingWindow, {
				id: "onboarding",
			});
		});

		onboardingWindow.on("close", () => {
			this.clearWindow("onboarding");
		});

		applyDefaultWindowOptions(onboardingWindow);

		if (DEV_SERVER_URL) {
			onboardingWindow.loadURL(DEV_SERVER_URL);
		} else {
			onboardingWindow.loadFile(HTML_PATH);
		}

		this.windows.set("onboarding", onboardingWindow);
		this.events.emit("window:created", "onboarding");

		return onboardingWindow;
	}

	public sendMessageToAllWindows(channel: string, ...args: any[]) {
		for (const window of this.windows.values()) {
			window.webContents.send(channel, ...args);
		}
	}

	private clearWindow(windowId: WindowId) {
		this.windows.delete(windowId);
	}
}
