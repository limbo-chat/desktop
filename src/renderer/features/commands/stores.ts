import type * as limbo from "@limbo/api";
import { create } from "zustand";

export interface CommandStore {
	commands: Map<string, limbo.Command>;
	addCommand: (command: limbo.Command) => void;
	removeCommand: (commandId: string) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
	commands: new Map(),
	addCommand: (command) => {
		set((state) => {
			const newCommands = new Map(state.commands);

			newCommands.set(command.id, command);

			return { commands: newCommands };
		});
	},
	removeCommand: (commandId) => {
		set((state) => {
			const newCommands = new Map(state.commands);

			newCommands.delete(commandId);

			return { commands: newCommands };
		});
	},
}));
