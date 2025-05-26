import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { DialogContent, DialogRoot } from "../../../components/dialog";
import { useCommandList, useCommands, useIsCommandPaletteOpen } from "../hooks";
import { setIsCommandPaletteOpen } from "../utils";

export const CommandPalette = () => {
	const commands = useCommandList();
	const commandMap = useCommands();
	const isCommandPaletteOpen = useIsCommandPaletteOpen();
	const [search, setSearch] = useState("");

	const fuse = useMemo(() => {
		return new Fuse(commands, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["id", "name"],
		});
	}, [commands]);

	const filteredCommands = useMemo(() => {
		if (!search) {
			return commands;
		}

		return fuse.search(search).map((item) => item.item);
	}, [fuse, search, commands]);

	const executeCommand = async (commandId: string) => {
		const command = commandMap.get(commandId);

		if (!command) {
			return;
		}

		// should the command palette be closed instantly or after the command is executed?

		setIsCommandPaletteOpen(false);
		setSearch("");

		try {
			await command.execute();
		} catch (error) {
			let errorMessage = "An unexpected error occurred";

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			// TODO, indicate error with toast
			console.error(`Error executing command "${command.name}":`, errorMessage);
		}
	};

	return (
		<DialogRoot
			open={isCommandPaletteOpen}
			onOpenChange={({ open }) => {
				setIsCommandPaletteOpen(open);
				setSearch("");
			}}
		>
			<DialogContent>
				<input
					placeholder="Search commands"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div>
					{filteredCommands.length === 0 && <p>No commands found</p>}
					{filteredCommands.map((command) => (
						<button key={command.id} onClick={() => executeCommand(command.id)}>
							{command.name}
						</button>
					))}
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
