import path from "node:path";
import { app } from "electron";

export const DB_PATH = path.join(app.getPath("userData"), "db.sqlite");
