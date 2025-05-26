import type * as limbo from "limbo";
import { useCommandPaletteStore, useCommandStore } from "./stores";

export function addCommand(command: limbo.Command) {
	const commandStore = useCommandStore.getState();

	commandStore.addCommand(command);
}

export function removeCommand(commandId: string) {
	const commandStore = useCommandStore.getState();

	commandStore.removeCommand(commandId);
}

export function setIsCommandPaletteOpen(isOpen: boolean) {
	const commandPaletteStore = useCommandPaletteStore.getState();

	commandPaletteStore.setIsOpen(isOpen);
}
