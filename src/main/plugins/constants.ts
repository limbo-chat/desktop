import { app } from "electron";
import path from "node:path";

export const PLUGINS_DIR = path.join(app.getPath("userData"), "plugins");
export const PLUGIN_MANIFEST_FILE = "plugin.json";
export const PLUGIN_JS_FILE = "plugin.js";
export const PLUGIN_DATA_FILE = "data.json";
export const PLUGIN_DATABASE_FILE = "db.sqlite";
