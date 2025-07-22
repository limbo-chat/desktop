import { createContext } from "react";
import type { ViewStackState } from "./types";

export const viewStackContext = createContext<ViewStackState | null>(null);
