import type { PropsWithChildren } from "react";
import { preferencesContext } from "./context";

export interface PreferencesProviderProps {
	preferences: Record<string, unknown>;
}

export const PreferencesProvider = ({
	preferences,
	children,
}: PropsWithChildren<PreferencesProviderProps>) => {
	return (
		<preferencesContext.Provider value={preferences}>{children}</preferencesContext.Provider>
	);
};
