interface Window {
	env: {
		PLATFORM: string;
		LIMBO_API_VERSION: string;
		DISCORD_INVITE_URL: string;
	};
	ipcRenderer: import("electron").IpcRenderer;
}
