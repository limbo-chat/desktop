import { app } from "electron";
import path from "node:path";

export const SETTINGS_PATH = path.join(app.getPath("userData"), "settings.json");
