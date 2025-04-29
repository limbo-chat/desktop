/// <reference types="vite-plugin-electron/electron-env" />

interface Window {
	env: {
		LIMBO_API_VERSION: string;
	};
	ipcRenderer: import("electron").IpcRenderer;
}
