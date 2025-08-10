import path from "node:path";
import { app } from "electron";

export const SETTINGS_PATH = path.join(app.getPath("userData"), "settings.json");
