import path from "node:path";
import { app } from "electron";

export const META_FILE_NAME = "meta.json";
export const META_FILE_PATH = path.join(app.getPath("userData"), META_FILE_NAME);
