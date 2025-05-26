import { useCallback, useEffect, useMemo } from "react";
import { useHotkey } from "../../hooks/common";
import { useCommandPaletteStore, useCommandStore } from "./stores";

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
		useCommandPaletteStore.getState().setIsOpen(true);
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
		const commandStore = useCommandStore.getState();

		commandStore.addCommand({
			id: "reload-plugins",
			name: "Reload Plugins",
			execute: () => {
				console.log("Reloading plugins...");
			},
		});
	}, []);
};
