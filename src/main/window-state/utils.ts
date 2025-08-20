import { type BrowserWindow } from "electron";
import type { AppDatabaseClient } from "../db/types";
import { getValue, setValue } from "../kv/utils";
import { windowStateSchema, type WindowState } from "./schemas";

export async function saveWindowState(db: AppDatabaseClient, windowState: WindowState) {
	await setValue(db, "window_state", windowState);
}

export async function getWindowState(db: AppDatabaseClient): Promise<WindowState | null> {
	const windowStateJson = await getValue(db, "window_state");

	if (!windowStateJson) {
		return null;
	}

	const windowStateParseResult = windowStateSchema.safeParse(windowStateJson);

	return windowStateParseResult.data ?? null;
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

export function manageWindowState(db: AppDatabaseClient, window: BrowserWindow) {
	window.on("close", async () => {
		const newWindowState = getWindowStateFromWindow(window);

		await saveWindowState(db, newWindowState);
	});
}
