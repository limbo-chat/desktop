import { createRequire } from "node:module";
import { Kysely, SqliteDialect } from "kysely";
import { DB_PATH } from "./constants";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

export const sqlite = Database(DB_PATH);

const dialect = new SqliteDialect({
	database: sqlite,
});

export const db = new Kysely<any>({
	dialect,
});
