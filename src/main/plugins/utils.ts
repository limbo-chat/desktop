import { Octokit } from "@octokit/rest";
import Sqlite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import fs from "node:fs";
import path from "node:path";
import {
	PLUGINS_DIR,
	PLUGIN_JS_FILE,
	PLUGIN_MANIFEST_FILE,
	PLUGIN_META_FILE,
	PLUGIN_DATABASE_FILE,
} from "./constants";
import {
	pluginMetaSchema,
	pluginManifestSchema,
	type PluginMeta,
	type PluginManifest,
} from "./schemas";
import type { PluginDatabase } from "./types";

const octokit = new Octokit();

function buildPluginPath(pluginId: string) {
	return path.join(PLUGINS_DIR, pluginId);
}

function buildPluginManifestPath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_MANIFEST_FILE);
}

function buildPluginJsPath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_JS_FILE);
}

function buildPluginMetaPath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_META_FILE);
}

function buildPluginDatabasePath(pluginId: string) {
	return path.join(buildPluginPath(pluginId), PLUGIN_DATABASE_FILE);
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

export function writePluginMeta(pluginId: string, meta: PluginMeta) {
	const pluginMetaPath = buildPluginMetaPath(pluginId);

	fs.writeFileSync(pluginMetaPath, JSON.stringify(meta));
}

const defaultPluginMeta: PluginMeta = { enabled: false };

export function readPluginMeta(pluginId: string) {
	const metaPath = buildPluginMetaPath(pluginId);

	if (!fs.existsSync(metaPath)) {
		writePluginMeta(pluginId, defaultPluginMeta);

		return defaultPluginMeta;
	}

	const metaStr = fs.readFileSync(metaPath, "utf8");
	const rawMeta = JSON.parse(metaStr);

	const pluginMetaParseResult = pluginMetaSchema.safeParse(rawMeta);

	if (!pluginMetaParseResult.success) {
		writePluginMeta(pluginId, defaultPluginMeta);

		return defaultPluginMeta;
	}

	return pluginMetaParseResult.data;
}

export function readPlugin(pluginId: string) {
	const manifest = readPluginManifest(pluginId);
	const js = readPluginJs(pluginId);
	const meta = readPluginMeta(pluginId);

	return {
		manifest,
		js,
		meta,
	};
}

export function updatePluginMeta(pluginId: string, updatedMeta: Partial<PluginMeta>) {
	const meta = readPluginMeta(pluginId);

	writePluginMeta(pluginId, { ...meta, ...updatedMeta });
}

export async function getPluginDatabase(pluginId: string) {
	const sqlite = Sqlite(buildPluginDatabasePath(pluginId));

	const db = new Kysely<PluginDatabase>({
		dialect: new SqliteDialect({
			database: sqlite,
		}),
	});

	await db.schema
		.createTable("settings")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("value", "text", (col) => col.notNull())
		.ifNotExists()
		.execute();

	return {
		db,
		sqlite,
	};
}

export function ensurePluginsDir() {
	if (!fs.existsSync(PLUGINS_DIR)) {
		fs.mkdirSync(PLUGINS_DIR, { recursive: true });
	}
}

export function readPluginIds() {
	const childEntities = fs.readdirSync(PLUGINS_DIR, {
		withFileTypes: true,
	});

	return childEntities.filter((entity) => entity.isDirectory()).map((entity) => entity.name);
}

export function readPlugins() {
	const pluginIds = readPluginIds();

	return pluginIds.map((pluginId) => readPlugin(pluginId));
}

export interface InstallPluginOptions {
	manifest: PluginManifest;
	js: string;
}

export function installPlugin({ manifest, js }: InstallPluginOptions) {
	// create the plugin directory
	fs.mkdirSync(buildPluginPath(manifest.id), { recursive: true });

	// write manifest
	fs.writeFileSync(buildPluginManifestPath(manifest.id), JSON.stringify(manifest));

	// write js file
	fs.writeFileSync(buildPluginJsPath(manifest.id), js);

	// write the default meta file
	fs.writeFileSync(buildPluginMetaPath(manifest.id), JSON.stringify(defaultPluginMeta));
}

export interface DownloadPluginFromGithubOptions {
	owner: string;
	repo: string;
}

export async function downloadPluginFromGithub(opts: DownloadPluginFromGithubOptions) {
	let latestRelease;

	try {
		latestRelease = await octokit.repos.getLatestRelease({
			owner: opts.owner,
			repo: opts.repo,
		});
	} catch {
		throw new Error("Failed to fetch latest release");
	}

	const manifestAsset = latestRelease.data.assets.find(
		(asset) => asset.name === PLUGIN_MANIFEST_FILE
	);

	if (!manifestAsset) {
		throw new Error("Manifest file not found in release");
	}

	const jsAsset = latestRelease.data.assets.find((asset) => asset.name === PLUGIN_JS_FILE);

	if (!jsAsset) {
		throw new Error("Javascript file not found in release");
	}

	// download plugin.json file
	let manifestRaw;

	try {
		const manifestResponse = await fetch(manifestAsset.browser_download_url);
		manifestRaw = await manifestResponse.json();
	} catch {
		throw new Error("Failed to download plugin manifest");
	}

	const manifestParseResult = pluginManifestSchema.safeParse(manifestRaw);

	if (!manifestParseResult.success) {
		throw new Error("Invalid plugin manifest");
	}

	const pluginManifest = manifestParseResult.data;

	// download plugin.js file
	let jsText;

	try {
		const jsResponse = await fetch(jsAsset.browser_download_url);
		jsText = await jsResponse.text();
	} catch {
		throw new Error("Failed to download plugin javascript file");
	}

	return {
		manifest: pluginManifest,
		js: jsText,
	};
}

export function uninstallPlugin(pluginId: string) {
	fs.rmSync(buildPluginPath(pluginId), { recursive: true, force: true });
}
