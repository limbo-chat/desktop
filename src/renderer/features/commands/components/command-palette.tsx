import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { EmptyStateDescription, EmptyStateTitle } from "../../../components/empty-state";
import { useModalContext } from "../../modals/hooks";
import { showNotification } from "../../notifications/utils";
import * as ListQuickPicker from "../../quick-picker/components/list-primitive";
import * as QuickPicker from "../../quick-picker/components/primitive";
import { useCommandList, useCommands } from "../hooks";

export interface CommandPaletteProps {
	onExecuteCommand: (commandId: string) => void;
}

export const CommandPalette = ({ onExecuteCommand }: CommandPaletteProps) => {
	const [focusedCommandId, setFocuseCommandId] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	const commands = useCommandList();

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

	const filteredCommandIds = useMemo(() => {
		return filteredCommands.map((item) => item.id);
	}, [filteredCommands]);

	const handleSelect = (commandId: string) => {
		onExecuteCommand(commandId);
	};

	return (
		<ListQuickPicker.Root
			className="command-palette"
			items={filteredCommandIds}
			focusedId={focusedCommandId}
			selectedId={null}
			onFocusedIdChange={setFocuseCommandId}
			onSelectedIdChange={handleSelect}
		>
			<QuickPicker.Header>
				<QuickPicker.Search>
					<QuickPicker.SearchInput
						placeholder="Search commands..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</QuickPicker.Search>
			</QuickPicker.Header>
			<QuickPicker.Content>
				{filteredCommands.length > 0 ? (
					<ListQuickPicker.List>
						{filteredCommands.map((item) => (
							<ListQuickPicker.ListItem
								item={{
									id: item.id,
									title: item.name,
									description: "",
								}}
								key={item.id}
							/>
						))}
					</ListQuickPicker.List>
				) : (
					<QuickPicker.EmptyState>
						<EmptyStateTitle>No commands found</EmptyStateTitle>
						<EmptyStateDescription>Try another search</EmptyStateDescription>
					</QuickPicker.EmptyState>
				)}
			</QuickPicker.Content>
		</ListQuickPicker.Root>
	);
};

export const CommandPaletteModal = () => {
	const modalCtx = useModalContext();
	const commandMap = useCommands();

	const executeCommand = async (commandId: string) => {
		const command = commandMap.get(commandId);

		if (!command) {
			return;
		}

		// should the command palette be closed instantly or after the command is executed?

		modalCtx.close();

		try {
			await command.execute();
		} catch (error) {
			let errorMessage = "An unexpected error occurred";

			if (error instanceof Error) {
				errorMessage = error.message;
			}

			showNotification({
				level: "error",
				title: "Command failed",
				message: errorMessage,
			});
		}
	};

	return <CommandPalette onExecuteCommand={executeCommand} />;
};
