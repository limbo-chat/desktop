import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";
import EventEmitter from "eventemitter3";
import { DEV_SERVER_URL, PRELOAD_FILE_PATH, HTML_PATH } from "../constants";
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
		const mainWindow = new BrowserWindow({
			title: "Limbo",
			titleBarStyle: "hidden",
			minHeight: 200,
			minWidth: 300,
			show: false,
			height: 600,
			width: 800,
			titleBarOverlay: process.platform !== "darwin",
			webPreferences: {
				preload: PRELOAD_FILE_PATH,
				webSecurity: false,
			},
			...opts,
		});

		mainWindow.on("close", () => {
			this.clearWindow("main");
		});

		applyDefaultWindowOptions(mainWindow);

		if (DEV_SERVER_URL) {
			mainWindow.loadURL(DEV_SERVER_URL);
		} else {
			mainWindow.loadURL(`file://${HTML_PATH}`);
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
