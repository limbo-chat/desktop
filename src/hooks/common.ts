import { useEffect, useState, type Ref, type RefObject } from "react";

export const useIsAppFocused = () => {
	const [isAppFocused, setIsAppFocused] = useState(true);

	useEffect(() => {
		const focusHandler = () => {
			setIsAppFocused(true);
		};

		const blurHandler = () => {
			setIsAppFocused(false);
		};

		window.ipcRenderer.on("focus", focusHandler);
		window.ipcRenderer.on("blur", blurHandler);

		return () => {
			window.ipcRenderer.off("focus", focusHandler);
			window.ipcRenderer.off("blur", blurHandler);
		};
	});

	return isAppFocused;
};

export interface UseIsAtBottomOptions {
	ref: RefObject<HTMLElement | null>;
	threshold?: number;
}

export const useIsAtBottom = ({ ref, threshold = 0 }: UseIsAtBottomOptions) => {
	const [isAtBottom, setIsAtBottom] = useState(true);

	useEffect(() => {
		const el = ref.current;

		if (!el) {
			return;
		}

		const handleScroll = () => {
			const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

			setIsAtBottom(distanceFromBottom <= threshold);
		};

		handleScroll(); // Initial check

		el.addEventListener("scroll", handleScroll);

		return () => {
			el.removeEventListener("scroll", handleScroll);
		};
	}, [ref, threshold]);

	return isAtBottom;
};
