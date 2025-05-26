import { useCallback, useEffect, useMemo } from "react";
import { useHotkey } from "../../hooks/common";
import { useCommandPaletteStore, useCommandStore } from "./stores";
import { addCommand, setIsCommandPaletteOpen } from "./utils";

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
	const executeHotkey = useCallback(() => {
		setIsCommandPaletteOpen(true);
	}, []);

	useHotkey({
		key: "p",
		metakey: true,
		execute: executeHotkey,
	});
};

export const useIsCommandPaletteOpen = () => {
	return useCommandPaletteStore((state) => state.isOpen);
};

export const useRegisterCoreCommands = () => {
	useEffect(() => {
		addCommand({
			id: "reload-plugins",
			name: "Reload Plugins",
			execute: () => {
				// todo just a stub command for now
			},
		});
	}, []);
};
