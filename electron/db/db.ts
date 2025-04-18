import { createRequire } from "node:module";
import { FileMigrationProvider, Kysely, Migrator, SqliteDialect } from "kysely";
import { DB_PATH, MIGRATIONS_PATH } from "./constants";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

export const sqlite = Database(DB_PATH);

const dialect = new SqliteDialect({
	database: sqlite,
});

export const db = new Kysely<any>({
	dialect,
});
