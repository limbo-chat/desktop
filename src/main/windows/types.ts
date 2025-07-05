import type { PlatformName } from "../utils";

export type WindowType = "main";

export interface WindowInfo {
	type: WindowType;
	platform: PlatformName;
}
