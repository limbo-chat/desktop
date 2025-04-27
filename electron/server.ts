import http from "node:http";
import createRouter from "find-my-way";
import type { BrowserWindow } from "electron";

// TODO refactor to be OOP

export function createServer(mainWindow: BrowserWindow) {
	const router = createRouter();

	router.on("POST", "/plugins/:pluginId/reload", async (req, res, params) => {
		const pluginId = params.pluginId as string;

		mainWindow.webContents.send("plugin-reload", pluginId);

		res.writeHead(200, { "Content-Type": "application/json" });

		res.end(
			JSON.stringify({
				success: true,
			})
		);
	});

	return http.createServer((req, res) => {
		router.lookup(req, res);
	});
}
