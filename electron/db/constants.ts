import { app } from "electron";
import path from "node:path";

export const DB_PATH = path.join(app.getPath("userData"), "db.sqlite");
