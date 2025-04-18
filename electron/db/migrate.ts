import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "./db";
import { MIGRATIONS_PATH } from "./constants";
import path from "node:path";
import fs from "node:fs/promises";

export const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		migrationFolder: MIGRATIONS_PATH,
		path,
		fs,
	}),
});

export function migrateToLatest() {
	return migrator.migrateToLatest();
}
