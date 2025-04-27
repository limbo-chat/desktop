import { app } from "electron";
import path from "node:path";

export const CUSTOM_STYLES_DIR = path.join(app.getPath("userData"), "styles");
