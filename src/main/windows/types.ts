import type { PlatformName } from "../utils";

export type WindowId = "main" | "onboarding";

export interface WindowInfo {
	id: WindowId;
	platform: PlatformName;
}
