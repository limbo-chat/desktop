import { DialogContent, DialogRoot } from "../../../components/dialog";
import { useCommandList, useIsCommandPaletteOpen } from "../hooks";
import { setIsCommandPaletteOpen } from "../utils";

export const CommandPalette = () => {
	const commands = useCommandList();
	const isCommandPaletteOpen = useIsCommandPaletteOpen();

	return (
		<DialogRoot
			open={isCommandPaletteOpen}
			onOpenChange={({ open }) => {
				setIsCommandPaletteOpen(open);
			}}
		>
			<DialogContent>
				<div>
					{commands.map((command) => (
						<button key={command.id} onClick={command.execute}>
							{command.name}
						</button>
					))}
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
