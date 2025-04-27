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
			ignored: (path, stats) => (stats?.isFile() && !path.endsWith(".css")) ?? false,
		});

		this.watcher.on("add", (filePath) => {
			const relativeCssPath = path.relative(CUSTOM_STYLES_DIR, filePath);

			this.window.webContents.send("custom-style:add", relativeCssPath);
		});

		this.watcher.on("change", (filePath) => {
			const relativeCssPath = path.relative(CUSTOM_STYLES_DIR, filePath);

			console.log("Custom style changed:", relativeCssPath);

			this.window.webContents.send("custom-style:reload", relativeCssPath);
		});

		this.watcher.on("unlink", (filePath) => {
			const relativeCssPath = path.relative(CUSTOM_STYLES_DIR, filePath);

			this.window.webContents.send("custom-style:remove", relativeCssPath);
		});
	}

	public stop() {
		if (!this.watcher) {
			return;
		}

		this.watcher.close();
	}
}
