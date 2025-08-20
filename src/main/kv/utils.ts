import type { AppDatabaseClient } from "../db/types";

export async function getValue<T = unknown>(
	db: AppDatabaseClient,
	key: string
): Promise<T | undefined> {
	const result = await db.selectFrom("kv").selectAll().where("key", "=", key).executeTakeFirst();

	if (!result) {
		return undefined;
	}

	// if the value isn't already parsed by the kysely plugin, parse it
	if (typeof result.value === "string") {
		return JSON.parse(result.value) as T;
	}

	return result.value;
}

export async function setValue(db: AppDatabaseClient, key: string, value: unknown) {
	const jsonString = JSON.stringify(value);

	await db
		.insertInto("kv")
		.values({ key, value: jsonString })
		.onConflict((oc) => {
			return oc.doUpdateSet({
				value: jsonString,
			});
		})
		.execute();
}

export async function getOrSetValue<T = unknown>(
	db: AppDatabaseClient,
	key: string,
	value: T
): Promise<T> {
	const existingValue = await getValue<T>(db, key);

	if (existingValue !== undefined) {
		return existingValue;
	}

	await setValue(db, key, value);

	return value;
}

export async function deleteValue(db: AppDatabaseClient, key: string) {
	const result = await db.deleteFrom("kv").where("key", "=", key).execute();

	return result;
}
