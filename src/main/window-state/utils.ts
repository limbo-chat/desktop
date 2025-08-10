import fs from "node:fs";
import { type BrowserWindow } from "electron";
import { WINDOW_STATE_PATH } from "./constants";
import { windowStateSchema, type WindowState } from "./schemas";

export function readWindowState(): WindowState | null {
	try {
		const windowStateStr = fs.readFileSync(WINDOW_STATE_PATH, "utf8");
		const rawWindowState = JSON.parse(windowStateStr);

		return windowStateSchema.parse(rawWindowState);
	} catch (error) {
		return null;
	}
}

export function writeWindowState(windowState: WindowState) {
	fs.writeFileSync(WINDOW_STATE_PATH, JSON.stringify(windowState));
}

export function getWindowStateFromWindow(window: BrowserWindow): WindowState {
	const bounds = window.getBounds();

	return {
		x: bounds.x,
		y: bounds.y,
		width: bounds.width,
		height: bounds.height,
	};
}

export function manageWindowState(window: BrowserWindow) {
	window.on("close", () => {
		const newWindowState = getWindowStateFromWindow(window);

		writeWindowState(newWindowState);
	});
}
