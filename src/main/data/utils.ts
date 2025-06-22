import { ensureCustomStylesDirectory } from "../custom-styles/utils";
import { ensureDb } from "../db/utils";
import { ensureMeta } from "../meta/utils";
import { ensurePluginsDir } from "../plugins/utils";
import { ensureSettings } from "../settings/utils";
import { LATEST_DATA_VERSION } from "./constants";
import { migrations } from "./migrations";

export async function ensureData() {
	await Promise.all([
		ensureMeta(),
		ensureSettings(),
		ensurePluginsDir(),
		ensureCustomStylesDirectory(),
		ensureDb(),
	]);
}

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
