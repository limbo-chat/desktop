import fs from "node:fs";
import path from "node:path";
import { PLUGINS_DIR, PLUGIN_DATA_FILE, PLUGIN_JS_FILE, PLUGIN_MANIFEST_FILE } from "./constants";
import { pluginDataSchema, pluginManifestSchema, type PluginData } from "./schemas";

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

export function readPluginManifest(pluginId: string) {
	const manifestPath = buildPluginManifestPath(pluginId);

	if (!fs.existsSync(manifestPath)) {
		throw new Error(`Manifest file for ${pluginId} does not exist`);
	}

	const manifestStr = fs.readFileSync(manifestPath, "utf8");
	const manifestObj = JSON.parse(manifestStr);

	return pluginManifestSchema.parse(manifestObj);
}

export function readPluginJs(pluginId: string) {
	const jsPath = buildPluginJsPath(pluginId);

	if (!fs.existsSync(jsPath)) {
		throw new Error(`Javascript file for ${pluginId} does not exist`);
	}

	return fs.readFileSync(jsPath, "utf8");
}

export function writePluginData(pluginId: string, data: PluginData) {
	const pluginDataPath = buildPluginDataPath(pluginId);

	fs.writeFileSync(pluginDataPath, JSON.stringify(data));
}

const defaultPluginData: PluginData = { enabled: false, settings: {} };

export function readPluginData(pluginId: string) {
	const dataPath = buildPluginDataPath(pluginId);

	if (!fs.existsSync(dataPath)) {
		writePluginData(pluginId, defaultPluginData);

		return defaultPluginData;
	}

	const dataStr = fs.readFileSync(dataPath, "utf8");
	const dataObj = JSON.parse(dataStr);

	const pluginDataParseResult = pluginDataSchema.safeParse(dataObj);

	if (!pluginDataParseResult.success) {
		writePluginData(pluginId, defaultPluginData);

		return defaultPluginData;
	}

	return pluginDataParseResult.data;
}

export function updatePluginData(pluginId: string, updatedData: Partial<PluginData>) {
	const data = readPluginData(pluginId);

	writePluginData(pluginId, { ...data, ...updatedData });
}

export function ensurePluginsDir() {
	if (!fs.existsSync(PLUGINS_DIR)) {
		fs.mkdirSync(PLUGINS_DIR, { recursive: true });
	}
}

export function readPluginIds() {
	ensurePluginsDir();

	return fs.readdirSync(PLUGINS_DIR);
}

export function uninstallPlugin(pluginId: string) {
	fs.rmSync(buildPluginPath(pluginId), { recursive: true, force: true });
}
