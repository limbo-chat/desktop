import path from "node:path";
import { FSWatcher, watch } from "chokidar";
import type { BrowserWindow } from "electron";
import { PLUGINS_DIR } from "./constants";

export interface PluginWatcherOptions {
	window: BrowserWindow;
}

export class PluginWatcher {
	private window: BrowserWindow;
	private watcher: FSWatcher | null = null;

	constructor(opts: PluginWatcherOptions) {
		this.window = opts.window;
	}

	public start() {
		this.watcher = watch(PLUGINS_DIR, {
			persistent: true,
			ignoreInitial: true,
			cwd: PLUGINS_DIR,
			ignored: (path, stats) => {
				if (!stats) {
					return false;
				}

				// don't ignore directories
				if (stats.isDirectory()) {
					return false;
				}

				// only watch for changes in plugin.js or plugin.json
				return !(path.endsWith("plugin.js") || path.endsWith("plugin.json"));
			},
		});

		this.watcher.on("change", (filePath) => {
			const pluginId = path.dirname(filePath);

			this.window.webContents.send("plugin:reload", pluginId);
		});
	}

	public stop() {
		if (!this.watcher) {
			return;
		}

		this.watcher.close();
	}
}
