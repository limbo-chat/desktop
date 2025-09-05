import path from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ROOT = path.join(fileURLToPath(import.meta.url), "../../..");
export const DEV_SERVER_URL = process.env["ELECTRON_RENDERER_URL"];

export const RESOURCES_PATH = path.join(APP_ROOT, "resources");
export const DIST_PATH = path.join(APP_ROOT, "dist");

export const PRELOAD_DIST_PATH = path.join(DIST_PATH, "preload");
export const PRELOAD_FILE_PATH = path.join(PRELOAD_DIST_PATH, "main.cjs");

export const RENDERER_DIST_PATH = path.join(DIST_PATH, "renderer");
export const HTML_PATH = path.join(RENDERER_DIST_PATH, "index.html");

export const PROTOCOL = "limbo";
