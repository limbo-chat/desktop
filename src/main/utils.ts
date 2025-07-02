export type PlatformName = "windows" | "macos" | "linux" | "unknown";

export function getPlatformName(): PlatformName {
	switch (process.platform) {
		case "darwin":
			return "macos";
		case "win32":
			return "windows";
		case "linux":
			return "linux";
	}

	return "unknown";
}
