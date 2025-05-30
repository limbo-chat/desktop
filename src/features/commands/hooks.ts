import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { useHotkey } from "../../hooks/common";
import { useCommandPaletteStore, useCommandStore } from "./stores";
import { addCommand, removeCommand, setIsCommandPaletteOpen } from "./utils";

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
	const navigate = useNavigate();

	useEffect(() => {
		addCommand({
			id: "open-design-playground",
			name: "Open design playground",
			execute: () => {
				navigate({
					to: "/design-playground",
				});
			},
		});

		return () => {
			removeCommand("open-design-playground");
		};
	}, []);
};
