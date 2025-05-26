import { create } from "zustand";
import type * as limbo from "limbo";

export interface CommandStore {
	commands: Map<string, limbo.Command>;
	addCommand: (command: limbo.Command) => void;
	removeCommand: (commandId: string) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
	commands: new Map(),
	addCommand: (command) => {
		set((state) => {
			const newTools = new Map(state.commands);

			newTools.set(command.id, command);

			return { commands: newTools };
		});
	},
	removeCommand: (commandId) => {
		set((state) => {
			const newTools = new Map(state.commands);

			newTools.delete(commandId);

			return { commands: newTools };
		});
	},
}));

export interface CommandPaletteStore {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export const useCommandPaletteStore = create<CommandPaletteStore>((set) => ({
	isOpen: false,
	setIsOpen: (isOpen) => {
		set({ isOpen });
	},
}));
