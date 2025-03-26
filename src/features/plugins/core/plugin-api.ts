export class PluginAPI {
	private settings: string[] = [];

	public showNotification(message: string) {
		console.log("plugin notification", message);
	}

	public registerSetting(settingKey: string) {
		console.log("plugin registered setting", settingKey);

		this.settings.push(settingKey);
	}

	public removeSetting(settingKey: string) {
		this.settings = this.settings.filter((s) => s !== settingKey);
	}

	public registerLLM() {}
}
