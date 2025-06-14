import fs from "node:fs";
import { LATEST_DATA_VERSION } from "../migrations/constants";
import { META_FILE_NAME, META_FILE_PATH } from "./constants";
import { metaSchema, type Meta } from "./schemas";

export const defaultMeta: Meta = {
	dataVersion: LATEST_DATA_VERSION,
} as const;

export function readMeta() {
	let metaText;

	try {
		metaText = fs.readFileSync(META_FILE_PATH, "utf8");
	} catch {
		return null;
	}

	let rawMeta;

	try {
		rawMeta = JSON.parse(metaText);
	} catch {
		return null;
	}

	const metaParseResult = metaSchema.safeParse(rawMeta);

	if (!metaParseResult.success) {
		return null;
	}

	return metaParseResult.data;
}

export function writeMeta(meta: Meta) {
	fs.writeFileSync(META_FILE_PATH, JSON.stringify(meta));
}
