import { Migrator } from "kysely";
import { db } from "./db";
import * as migration0 from "./migrations/0";

export const migrator = new Migrator({
	db,
	provider: {
		async getMigrations() {
			return {
				"0": migration0,
			};
		},
	},
});

export async function migrateToLatest() {
	return await migrator.migrateToLatest();
}
