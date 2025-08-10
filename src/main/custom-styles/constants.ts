import path from "node:path";
import { app } from "electron";

export const CUSTOM_STYLES_DIR = path.join(app.getPath("userData"), "styles");
