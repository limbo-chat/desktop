import type * as limbo from "@limbo/api";
import { setActiveModal } from "../modals/utils";
import { CommandPaletteModal } from "./components/command-palette";
import { useCommandStore } from "./stores";

export function addCommand(command: limbo.Command) {
	const commandStore = useCommandStore.getState();

	commandStore.addCommand(command);
}

export function removeCommand(commandId: string) {
	const commandStore = useCommandStore.getState();

	commandStore.removeCommand(commandId);
}

export function showCommandPalette() {
	setActiveModal({
		className: "command-palette-modal",
		component: CommandPaletteModal,
	});
}
