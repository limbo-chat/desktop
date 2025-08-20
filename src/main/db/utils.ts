import Sqlite from "better-sqlite3";
import { Kysely, SqliteDialect, ParseJSONResultsPlugin } from "kysely";
import { getValue, setValue } from "../kv/utils";
import { DB_PATH, LATEST_DATA_VERSION } from "./constants";
import { migrations } from "./migrations";
import type { AppDatabase, AppDatabaseClient } from "./types";

async function migrateToLatestVersion(db: Kysely<any>, currentDataVersion: number) {
	let version = currentDataVersion;

	const transaction = await db.startTransaction().execute();

	try {
		while (version < LATEST_DATA_VERSION) {
			const migration = migrations[version];

			if (!migration) {
				continue;
			}

			await migration(transaction);

			version++;
		}

		// commit the transaction
		await transaction.commit().execute();
	} catch (err) {
		await transaction.rollback().execute();

		throw err;
	}
}

export async function getDb(): Promise<AppDatabaseClient> {
	const sqlite = Sqlite(DB_PATH);

	const db = new Kysely<AppDatabase>({
		dialect: new SqliteDialect({
			database: sqlite,
		}),
		plugins: [new ParseJSONResultsPlugin()],
	});

	let currentDataVersion = 0;

	try {
		const dataVersion = await getValue<number>(db, "data_version");

		if (typeof dataVersion === "number") {
			currentDataVersion = dataVersion;
		}
	} catch (err) {
		// table probably doesn't exist, leave currentDataVersion as 0
	}

	// check if the user's data version is behind the latest version
	if (currentDataVersion < LATEST_DATA_VERSION) {
		// if so, run migrations to bring it up to date
		await migrateToLatestVersion(db, currentDataVersion);

		// update the meta file with the latest data version
		await setValue(db, "data_version", LATEST_DATA_VERSION);
	}

	return db;
}
