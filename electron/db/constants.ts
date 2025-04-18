import { app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DB_PATH = path.join(app.getPath("userData"), "db.sqlite");
export const MIGRATIONS_PATH = path.join(__dirname, "migrations");
