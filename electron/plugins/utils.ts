import fs from "node:fs";
import path from "node:path";
import { PLUGINS_DIR, PLUGIN_DATA_FILE, PLUGIN_JS_FILE, PLUGIN_MANIFEST_FILE } from "./constants";
import { pluginDataSchema, pluginManifestSchema, type PluginData } from "./schemas";

const defaultPluginData: PluginData = { enabled: false, settings: {} };

function buildPluginPath(pluginId: string) {
	return path.join(PLUGINS_DIR, pluginId);
}

function buildPluginManifestPath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_MANIFEST_FILE);
}

function buildPluginJsPath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_JS_FILE);
}

function buildPluginDataPath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_DATA_FILE);
}

function ensurePluginDataFile(pluginId: string) {
	const pluginDataPath = buildPluginDataPath(pluginId);

	if (!fs.existsSync(pluginDataPath)) {
		writePluginData(pluginId, defaultPluginData);
	}
}

function readPluginData(pluginId: string) {
	ensurePluginDataFile(pluginId);

	return fs.readFileSync(buildPluginDataPath(pluginId), "utf8");
}

function readPluginManifest(pluginId: string) {
	const manifestStr = fs.readFileSync(buildPluginManifestPath(pluginId), "utf8");
	const manifestObj = JSON.parse(manifestStr);

	return pluginManifestSchema.parse(manifestObj);
}

function getPluginData(pluginId: string) {
	const dataStr = readPluginData(pluginId);
	const dataObj = JSON.parse(dataStr);

	const pluginDataParseResult = pluginDataSchema.safeParse(dataObj);

	if (pluginDataParseResult.success) {
		return pluginDataParseResult.data;
	}

	writePluginData(pluginId, defaultPluginData);

	return defaultPluginData;
}

export function ensurePluginsDir() {
	if (!fs.existsSync(PLUGINS_DIR)) {
		fs.mkdirSync(PLUGINS_DIR, { recursive: true });
	}
}

export function writePluginData(pluginId: string, data: PluginData) {
	const pluginDataPath = buildPluginDataPath(pluginId);

	fs.writeFileSync(pluginDataPath, JSON.stringify(data));
}

export function writePluginSettings(pluginId: string, settings: PluginData["settings"]) {
	const data = getPluginData(pluginId);

	writePluginData(pluginId, { ...data, settings });
}

export function readPlugins() {
	ensurePluginsDir();

	return fs.readdirSync(PLUGINS_DIR);
}

export function getPlugin(pluginId: string) {
	let manifest;

	if (!fs.existsSync(buildPluginPath(pluginId))) {
		throw new Error(`Plugin ${pluginId} not found`);
	}

	try {
		manifest = readPluginManifest(pluginId);
	} catch {
		throw new Error(`Failed to read manifest for plugin ${pluginId}`);
	}

	let js;

	try {
		js = fs.readFileSync(buildPluginJsPath(pluginId), "utf8");
	} catch {
		throw new Error(`Failed to read js file for plugin ${pluginId}`);
	}

	let data;

	try {
		data = getPluginData(pluginId);
	} catch {
		throw new Error(`Failed to read plugin data for ${pluginId}`);
	}

	return {
		manifest,
		data,
		js,
	};
}

export function uninstallPlugin(pluginId: string) {
	fs.rmSync(buildPluginPath(pluginId), { recursive: true, force: true });
}
