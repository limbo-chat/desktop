import type { PropsWithChildren } from "react";
import type { WindowInfo } from "../../../main/windows/types";
import { windowInfoContext } from "./contexts";

export interface WindowInfoProviderProps {
	windowInfo: WindowInfo;
}

export const WindowInfoProvider = ({
	windowInfo,
	children,
}: PropsWithChildren<WindowInfoProviderProps>) => {
	return <windowInfoContext.Provider value={windowInfo}>{children}</windowInfoContext.Provider>;
};
