import fs from "node:fs";
import { SETTINGS_PATH } from "./constants";
import { settingsSchema, type Settings } from "./schemas";

export const defaultSettings: Settings = {
	username: "",
	systemPrompt:
		"You are a helpful assistant. You are currently conversing with {{user.username}}. Answer {{user.username}}'s questions to the best of your ability. ",
	isTransparencyEnabled: false,
	isDeveloperModeEnabled: false,
} as const;

export function ensureSettings() {
	if (!fs.existsSync(SETTINGS_PATH)) {
		writeSettings(defaultSettings);
	}
}

export function readSettings(): Settings {
	if (!fs.existsSync(SETTINGS_PATH)) {
		writeSettings(defaultSettings);

		return defaultSettings;
	}

	const settingsStr = fs.readFileSync(SETTINGS_PATH, "utf8");

	try {
		const settingsRaw = JSON.parse(settingsStr);
		const settings = settingsSchema.parse(settingsRaw);

		return settings;
	} catch (error) {
		writeSettings(defaultSettings);

		return defaultSettings;
	}
}

export function writeSettings(settings: Settings) {
	fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings));
}

export function updateSettings(partialSettings: Partial<Settings>): Settings {
	const currentSettings = readSettings();
	const updatedSettings = { ...currentSettings, ...partialSettings };

	writeSettings(updatedSettings);

	return updatedSettings;
}
