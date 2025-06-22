interface Window {
	env: {
		LIMBO_API_VERSION: string;
	};
	ipcRenderer: import("electron").IpcRenderer;
}
