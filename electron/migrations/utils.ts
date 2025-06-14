import { LATEST_DATA_VERSION } from "./constants";
import { migrations } from "./migrations";

export async function migrateToLatestVersion(userDataVersion: number) {
	let version = userDataVersion;

	while (version < LATEST_DATA_VERSION) {
		const migration = migrations[version];

		if (!migration) {
			continue;
		}

		await migration();

		version++;
	}
}
