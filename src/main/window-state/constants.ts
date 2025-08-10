import path from "node:path";
import { app } from "electron";

export const WINDOW_STATE_PATH = path.join(app.getPath("userData"), "window-state.json");
