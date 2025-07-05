import { app } from "electron";
import path from "node:path";

export const WORKSPACE_FILE_NAME = "workspace.json";
export const WORKSPACE_FILE_PATH = path.join(app.getPath("userData"), WORKSPACE_FILE_NAME);
