import type { AppDatabaseClient } from "../db/types";

export async function getValue(db: AppDatabaseClient, key: string): Promise<string | null> {
	const result = await db.selectFrom("kv").selectAll().where("key", "=", key).executeTakeFirst();

	if (!result) {
		return null;
	}

	return result.value;
}

export async function setValue(db: AppDatabaseClient, key: string, value: string) {
	await db
		.insertInto("kv")
		.values({ key, value })
		.onConflict((oc) => {
			return oc.doUpdateSet({
				value,
			});
		})
		.execute();
}

export async function getOrSetValue(db: AppDatabaseClient, key: string, value: string) {
	const existingValue = await getValue(db, key);

	if (existingValue !== null) {
		return existingValue;
	}

	await setValue(db, key, value);

	return value;
}

export async function deleteValue(db: AppDatabaseClient, key: string) {
	const result = await db.deleteFrom("kv").where("key", "=", key).execute();

	return result;
}
