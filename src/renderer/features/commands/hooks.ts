import { useEffect, useMemo } from "react";
import { useHotkey } from "../../hooks/common";
import { useCommandStore } from "./stores";
import { addCommand, removeCommand, showCommandPalette } from "./utils";

export const useCommands = () => {
	return useCommandStore((state) => state.commands);
};

export const useCommandList = () => {
	const commands = useCommands();

	return useMemo(() => {
		return [...commands.values()];
	}, [commands]);
};

export const useOpenCommandPaletteHotkey = () => {
	useHotkey({
		key: "p",
		metakey: true,
		execute: showCommandPalette,
	});
};

export const useRegisterCoreCommands = () => {
	useEffect(() => {
		addCommand({
			id: "open-design-playground",
			name: "Open design playground",
			execute: () => {
				// navigate({
				// 	to: "/design-playground",
				// });
			},
		});

		return () => {
			removeCommand("open-design-playground");
		};
	}, []);
};
