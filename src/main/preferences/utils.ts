import type { AppDatabaseClient } from "../db/types";

export async function getPreference<T = unknown>(
	db: AppDatabaseClient,
	key: string
): Promise<T | undefined> {
	const result = await db
		.selectFrom("preference")
		.selectAll()
		.where("key", "=", key)
		.executeTakeFirst();

	if (!result) {
		return undefined;
	}

	// if the value isn't already parsed by the kysely plugin, parse it
	if (typeof result.value === "string") {
		return JSON.parse(result.value) as T;
	}

	return result.value;
}

export async function getAllPreferences(db: AppDatabaseClient): Promise<Record<string, unknown>> {
	const preferences = new Map<string, unknown>();

	const results = await db.selectFrom("preference").selectAll().execute();

	for (const row of results) {
		let value = row.value;

		if (typeof row.value === "string") {
			value = JSON.parse(row.value);
		}

		preferences.set(row.key, value);
	}

	return Object.fromEntries(preferences);
}

export async function setPreference(db: AppDatabaseClient, key: string, value: unknown) {
	const jsonString = JSON.stringify(value);

	await db
		.insertInto("preference")
		.values({ key, value: jsonString })
		.onConflict((oc) => {
			return oc.doUpdateSet({
				value: jsonString,
			});
		})
		.execute();
}
