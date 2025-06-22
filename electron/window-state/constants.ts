import { app } from "electron";
import path from "node:path";

export const WINDOW_STATE_PATH = path.join(app.getPath("userData"), "window-state.json");
