import clsx from "clsx";
import { useIsAppFocused } from "../../hooks/common";

export const Titlebar = () => {
	const isAppFocused = useIsAppFocused();

	return <div className={clsx("titlebar", isAppFocused && "app-focused")}></div>;
};
