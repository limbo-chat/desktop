import { createContext } from "react";
import type { WindowInfo } from "../../../main/windows/types";

export const windowInfoContext = createContext<WindowInfo | null>(null);
