import path from "node:path";
import type { BrowserWindow } from "electron";
import { watch, type FSWatcher } from "chokidar";
import EventEmitter from "eventemitter3";
import { CUSTOM_STYLES_DIR } from "./constants";

export interface CustomStylesWatcherEvents {
	add: (filePath: string) => void;
	change: (filePath: string) => void;
	remove: (filePath: string) => void;
}

export interface CustomStylesWatcherOptions {
	window: BrowserWindow;
}

export class CustomStylesWatcher {
	private watcher: FSWatcher | null = null;
	public events = new EventEmitter<CustomStylesWatcherEvents>();

	public start() {
		this.watcher = watch(CUSTOM_STYLES_DIR, {
			persistent: true,
			ignoreInitial: true,
			cwd: CUSTOM_STYLES_DIR,
			ignored: (curPath) => {
				const extname = path.extname(curPath);

				// don't ignore directories
				if (extname === "") {
					return false;
				}

				const isCssFile = extname === ".css";

				// ignore files that aren't CSS files
				return !isCssFile;
			},
		});

		this.watcher.on("add", (filePath) => {
			this.events.emit("add", filePath);
		});

		this.watcher.on("change", (filePath) => {
			this.events.emit("change", filePath);
		});

		this.watcher.on("unlink", (filePath) => {
			this.events.emit("remove", filePath);
		});
	}

	public stop() {
		if (!this.watcher) {
			return;
		}

		this.watcher.close();
	}
}
