import fs from "node:fs";
import path from "node:path";
import glob from "tiny-glob";
import { CUSTOM_STYLES_DIR } from "./constants";

export function ensureCustomStylesDirectory() {
	if (!fs.existsSync(CUSTOM_STYLES_DIR)) {
		fs.mkdirSync(CUSTOM_STYLES_DIR, { recursive: true });
	}
}

export async function readCustomStylePaths() {
	return await glob(path.join(CUSTOM_STYLES_DIR, "**/*.css"), {
		cwd: CUSTOM_STYLES_DIR,
	});
}

export function readCustomStyle(customStylePath: string) {
	return fs.readFileSync(path.join(CUSTOM_STYLES_DIR, customStylePath), "utf8");
}
