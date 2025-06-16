import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(APP_ROOT, "dist");
export const PRELOAD_DIST = path.join(MAIN_DIST, "preload.mjs");
export const HTML_PATH = path.join(RENDERER_DIST, "index.html");
export const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, "public") : RENDERER_DIST;
export const ICON_PATH = path.join(VITE_PUBLIC, "electron-vite.svg");
