import { DialogContent, DialogRoot } from "../../../components/dialog";
import { useCommandList, useIsCommandPaletteOpen } from "../hooks";
import { useCommandPaletteStore } from "../stores";

export const CommandPalette = () => {
	const commands = useCommandList();
	const isCommandPaletteOpen = useIsCommandPaletteOpen();

	return (
		<DialogRoot
			open={isCommandPaletteOpen}
			onOpenChange={({ open }) => {
				useCommandPaletteStore.getState().setIsOpen(open);
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
