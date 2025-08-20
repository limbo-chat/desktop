import { useEffect, useMemo, useState, type RefObject } from "react";

export const useIsAppFocused = () => {
	const [isAppFocused, setIsAppFocused] = useState(true);

	useEffect(() => {
		const focusHandler = () => {
			setIsAppFocused(true);
		};

		const blurHandler = () => {
			setIsAppFocused(false);
		};

		window.ipcRenderer.on("window:focus", focusHandler);
		window.ipcRenderer.on("window:blur", blurHandler);

		return () => {
			window.ipcRenderer.off("window:focus", focusHandler);
			window.ipcRenderer.off("window:blur", blurHandler);
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

		const checkIsAtBottom = () => {
			const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

			setIsAtBottom(distanceFromBottom <= threshold);
		};

		checkIsAtBottom(); // Initial check

		el.addEventListener("scroll", checkIsAtBottom);

		return () => {
			el.removeEventListener("scroll", checkIsAtBottom);
		};
	}, [ref, threshold]);

	return isAtBottom;
};

export interface UseHotkeyOptions {
	key: string;
	metakey?: boolean;
	execute: () => void;
}

export const useHotkey = ({ key, metakey, execute }: UseHotkeyOptions) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === key) {
				if (metakey && !event.metaKey) {
					return;
				}

				event.preventDefault();

				execute();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [key, metakey, execute]);
};

export const useAnimationUnmount = (isVisible: boolean) => {
	const [shouldMount, setShouldMount] = useState(isVisible);

	useEffect(() => {
		if (isVisible) {
			setShouldMount(true);
		}
	}, [isVisible]);

	const componentProps = useMemo(() => {
		return {
			onAnimationEnd: () => {
				if (!isVisible) {
					setShouldMount(false);
				}
			},
		};
	}, [isVisible]);

	return { shouldMount, props: componentProps };
};
