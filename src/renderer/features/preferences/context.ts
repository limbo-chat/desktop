import { createContext } from "react";

export const preferencesContext = createContext<Record<string, unknown> | null>(null);
