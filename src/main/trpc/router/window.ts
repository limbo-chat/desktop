import { BrowserWindow } from "electron";
import { publicProcedure, router } from "../trpc";

export const windowRouter = router({
	minimize: publicProcedure.mutation(() => {
		const focusedWindow = BrowserWindow.getFocusedWindow();

		if (focusedWindow) {
			focusedWindow.minimize();
		}
	}),
	maximize: publicProcedure.mutation(() => {
		const focusedWindow = BrowserWindow.getFocusedWindow();

		if (focusedWindow) {
			if (focusedWindow.isMaximized()) {
				focusedWindow.unmaximize();
			} else {
				focusedWindow.maximize();
			}
		}
	}),
	close: publicProcedure.mutation(() => {
		const focusedWindow = BrowserWindow.getFocusedWindow();

		if (focusedWindow) {
			focusedWindow.close();
		}
	}),
});
