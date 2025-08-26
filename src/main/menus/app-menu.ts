import { Menu } from "electron";
import type { WindowManager } from "../windows/manager";

export function createAppMenu(windowManager: WindowManager) {
	const menu = Menu.buildFromTemplate([
		{
			label: "File",
			submenu: [
				{ role: "about" },
				{ type: "separator" },
				{
					label: "Settings",
					accelerator: "CmdOrCtrl+,",
					click: () => {
						windowManager.sendMessageToAllWindows("settings:open");
					},
				},
				{ type: "separator" },
				{ role: "hide" },
				{ role: "hideOthers" },
				{ type: "separator" },
				{ role: "quit" },
			],
		},
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "togglefullscreen" },
				{ type: "separator" },
				{ role: "resetZoom" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ type: "separator" },
				{ role: "forceReload" },
				{ role: "toggleDevTools" },
			],
		},
		{
			label: "Window",
			role: "window",
			submenu: [
				{ role: "minimize" },
				{ role: "zoom" },
				{ type: "separator" },
				{ role: "close" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Home page",
					click: () => {
						// TODO, implement
					},
				},
				{
					label: "Documentation",
					click: () => {
						// TODO, implement
					},
				},
				{
					label: "Community",
					click: () => {
						// TODO, implement
					},
				},
			],
		},
	]);

	return menu;
}

export function setAppMenuPrimarySidebarChecked(menu: Menu, isChecked: boolean) {
	const menuItem = menu.getMenuItemById("toggle-primary-sidebar");

	if (menuItem) {
		menuItem.checked = isChecked;
	}
}

export function setAppMenuSecondarySidebarChecked(menu: Menu, isChecked: boolean) {
	const menuItem = menu.getMenuItemById("toggle-secondary-sidebar");

	if (menuItem) {
		menuItem.checked = isChecked;
	}
}
