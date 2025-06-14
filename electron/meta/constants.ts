import { app } from "electron";
import path from "node:path";

export const META_FILE_NAME = "meta.json";
export const META_FILE_PATH = path.join(app.getPath("userData"), META_FILE_NAME);
