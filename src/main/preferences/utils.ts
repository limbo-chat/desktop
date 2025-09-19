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
