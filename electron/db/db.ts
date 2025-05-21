import { Kysely, SqliteDialect } from "kysely";
import { createRequire } from "node:module";
import { DB_PATH } from "./constants";
import type { Database } from "./types";

const require = createRequire(import.meta.url);
const Sqlite = require("better-sqlite3");

export const sqlite = Sqlite(DB_PATH);

const dialect = new SqliteDialect({
	database: sqlite,
});

export const db = new Kysely<Database>({
	dialect,
});
