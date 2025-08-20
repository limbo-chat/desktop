import type { AppDatabaseClient } from "../db/types";

export async function getPreference(db: AppDatabaseClient, key: string): Promise<string | null> {
	const result = await db
		.selectFrom("preference")
		.selectAll()
		.where("key", "=", key)
		.executeTakeFirst();

	if (!result) {
		return null;
	}

	return result.value;
}

export async function getAllPreferences(db: AppDatabaseClient): Promise<Record<string, string>> {
	const preferences = new Map<string, string>();

	const results = await db.selectFrom("preference").selectAll().execute();

	for (const row of results) {
		preferences.set(row.key, row.value);
	}

	return Object.fromEntries(preferences);
}

export async function setPreference(db: AppDatabaseClient, key: string, value: string) {
	await db
		.insertInto("preference")
		.values({ key, value })
		.onConflict((oc) => {
			return oc.doUpdateSet({
				value,
			});
		})
		.execute();
}
