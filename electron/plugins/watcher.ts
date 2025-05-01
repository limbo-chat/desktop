import curPath from "node:path";
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
			depth: 1,
			ignored: (curPath) => {
				if (curPath === PLUGINS_DIR) {
					return false;
				}

				const relativePath = curPath.substring(PLUGINS_DIR.length + 1);
				const parts = relativePath.split("/");

				// If we have a path with more than 2 segments, it's a nested directory or file
				// Allow only plugin-name and plugin-name/specified-files
				if (parts.length > 2) {
					return false;
				}

				// If it's a file, only allow plugin.json and plugin.js
				if (parts.length === 2) {
					const fileName = parts[1];
					const isPluginFile = fileName === "plugin.json" || fileName === "plugin.js";

					return !isPluginFile;
				}

				return false;
			},
		});

		this.watcher.on("change", (filePath) => {
			const pluginId = curPath.dirname(filePath);

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
