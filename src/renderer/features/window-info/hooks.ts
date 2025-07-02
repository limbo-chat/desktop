import { useContext } from "react";
import { windowInfoContext } from "./contexts";

export const useWindowInfoContext = () => {
	const ctx = useContext(windowInfoContext);

	if (!ctx) {
		throw new Error("useWindowInfoContext must be used within a WindowInfoProvider");
	}

	return ctx;
};
