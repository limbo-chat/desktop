import { createContext } from "react";

export const preferencesContext = createContext<Record<string, string> | null>(null);
