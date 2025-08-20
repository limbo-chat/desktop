import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import EventEmitter from "eventemitter3";
import { DEV_SERVER_URL, ICON_PATH, PRELOAD_FILE_PATH, HTML_PATH } from "../constants";
import { getPlatformName } from "../utils";
import { manageWindowState, readWindowState } from "../window-state/utils";
import type { WindowType } from "./types";
import { applyDefaultWindowOptions } from "./utils";

export interface WindowManagerEvents {
	"window:created": (windowType: WindowType) => void;
}

export class WindowManager {
	public events = new EventEmitter<WindowManagerEvents>();
	private windows = new Map<WindowType, Electron.BrowserWindow>();

	public getWindow(type: WindowType) {
		return this.windows.get(type);
	}

	public createMainWindow(opts?: Partial<BrowserWindowConstructorOptions>) {
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
			titleBarOverlay: process.platform !== "darwin",
			webPreferences: {
				preload: PRELOAD_FILE_PATH,
			},
			...opts,
		});

		mainWindow.on("close", () => {
			this.clearWindow("main");
		});

		applyDefaultWindowOptions(mainWindow);

		// we want to track the state of the main window
		manageWindowState(mainWindow);

		const queryParams = new URLSearchParams({
			type: "main",
			platform: getPlatformName(),
		});

		if (DEV_SERVER_URL) {
			mainWindow.loadURL(`${DEV_SERVER_URL}?${queryParams.toString()}`);
		} else {
			mainWindow.loadURL(`file://${HTML_PATH}?${queryParams.toString()}`);
		}

		this.windows.set("main", mainWindow);

		this.events.emit("window:created", "main");

		return mainWindow;
	}

	public sendMessageToAllWindows(channel: string, ...args: any[]) {
		for (const window of this.windows.values()) {
			window.webContents.send(channel, ...args);
		}
	}

	private clearWindow(windowType: WindowType) {
		this.windows.delete(windowType);
	}
}
