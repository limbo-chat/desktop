import path from "node:path";
import { watch, type FSWatcher } from "chokidar";
import { CUSTOM_STYLES_DIR } from "./constants";
import type { BrowserWindow } from "electron";

export interface CustomStylesWatcherOptions {
	window: BrowserWindow;
}

export class CustomStylesWatcher {
	private watcher: FSWatcher | null = null;
	private window: BrowserWindow;

	constructor(opts: CustomStylesWatcherOptions) {
		this.window = opts.window;
	}

	public start() {
		this.watcher = watch(path.join(CUSTOM_STYLES_DIR), {
			persistent: true,
			ignoreInitial: true,
			cwd: CUSTOM_STYLES_DIR,
			// ignore files that aren't CSS files
			ignored: (path, stats) =>
				stats !== undefined && stats.isFile() && !path.endsWith(".css"),
		});

		this.watcher.on("add", (filePath) => {
			this.window.webContents.send("custom-style:add", filePath);
		});

		this.watcher.on("change", (filePath) => {
			this.window.webContents.send("custom-style:reload", filePath);
		});

		this.watcher.on("unlink", (filePath) => {
			this.window.webContents.send("custom-style:remove", filePath);
		});
	}

	public stop() {
		if (!this.watcher) {
			return;
		}

		this.watcher.close();
	}
}
