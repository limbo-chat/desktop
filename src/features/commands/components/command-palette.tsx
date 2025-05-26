import { DialogContent, DialogRoot } from "../../../components/dialog";
import { useCommandList, useCommands, useIsCommandPaletteOpen } from "../hooks";
import { setIsCommandPaletteOpen } from "../utils";

export const CommandPalette = () => {
	const commandMap = useCommands();
	const commandList = useCommandList();
	const isCommandPaletteOpen = useIsCommandPaletteOpen();

	const executeCommand = async (commandId: string) => {
		const command = commandMap.get(commandId);

		if (!command) {
			return;
		}

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
			}}
		>
			<DialogContent>
				<div>
					{commandList.map((command) => (
						<button key={command.id} onClick={() => executeCommand(command.id)}>
							{command.name}
						</button>
					))}
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
