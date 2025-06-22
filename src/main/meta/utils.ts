import fs from "node:fs";
import { LATEST_DATA_VERSION } from "../data/constants";
import { META_FILE_PATH } from "./constants";
import { metaSchema, type Meta } from "./schemas";

export const defaultMeta: Meta = {
	dataVersion: LATEST_DATA_VERSION,
} as const;

export function writeMeta(meta: Meta) {
	fs.writeFileSync(META_FILE_PATH, JSON.stringify(meta));
}

export function ensureMeta() {
	if (!fs.existsSync(META_FILE_PATH)) {
		writeMeta(defaultMeta);
	}
}

export function readMeta(): Meta {
	let metaStr;

	try {
		metaStr = fs.readFileSync(META_FILE_PATH, "utf8");
	} catch {
		writeMeta(defaultMeta);

		return defaultMeta;
	}

	let rawMeta;

	try {
		rawMeta = JSON.parse(metaStr);
	} catch {
		writeMeta(defaultMeta);

		return defaultMeta;
	}

	const metaParseResult = metaSchema.safeParse(rawMeta);

	if (!metaParseResult.success) {
		writeMeta(defaultMeta);

		return defaultMeta;
	}

	return metaParseResult.data;
}
