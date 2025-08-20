import { useMemo } from "react";
import { useHotkey } from "../../hooks/common";
import { useCommandStore } from "./stores";
import { showCommandPalette } from "./utils";

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
		execute: () => {
			showCommandPalette();
		},
	});
};
