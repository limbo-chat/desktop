import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { ModalContent, ModalRoot } from "../../../components/modal";
import {
	EmptyResult,
	SearchPrompt,
	SearchPromptInput,
	SearchPromptInputContainer,
	SearchPromptInstructionCommand,
	SearchPromptInstructionItem,
	SearchPromptInstructions,
	SearchPromptInstructionText,
	SearchPromptResults,
	ResultContent,
	ResultItem,
	ResultTitle,
} from "../../../components/search-prompt";
import { useCommandList, useCommands, useIsCommandPaletteOpen } from "../hooks";
import { setIsCommandPaletteOpen } from "../utils";

interface CommandPaletteProps {
	search: string;
	onSearchChange: (search: string) => void;
	onExecuteCommand: (commandId: string) => void;
}

const CommandPalette = ({ search, onSearchChange, onExecuteCommand }: CommandPaletteProps) => {
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

	return (
		<SearchPrompt className="command-palette">
			<SearchPromptInputContainer>
				<SearchPromptInput
					placeholder="Search commands..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</SearchPromptInputContainer>
			<SearchPromptResults>
				{filteredCommands.length === 0 && <EmptyResult>No commands found</EmptyResult>}
				{filteredCommands.map((command) => (
					<ResultItem key={command.id} onClick={() => onExecuteCommand(command.id)}>
						<ResultContent>
							<ResultTitle>{command.name}</ResultTitle>
						</ResultContent>
					</ResultItem>
				))}
			</SearchPromptResults>
			<SearchPromptInstructions>
				<SearchPromptInstructionItem>
					<SearchPromptInstructionCommand>↑↓</SearchPromptInstructionCommand>
					<SearchPromptInstructionText>to navigate</SearchPromptInstructionText>
				</SearchPromptInstructionItem>
				<SearchPromptInstructionItem>
					<SearchPromptInstructionCommand>↵</SearchPromptInstructionCommand>
					<SearchPromptInstructionText>to use</SearchPromptInstructionText>
				</SearchPromptInstructionItem>
				<SearchPromptInstructionItem>
					<SearchPromptInstructionCommand>esc</SearchPromptInstructionCommand>
					<SearchPromptInstructionText>to dismiss</SearchPromptInstructionText>
				</SearchPromptInstructionItem>
			</SearchPromptInstructions>
		</SearchPrompt>
	);
};

export const CommandPaletteModal = () => {
	const commandMap = useCommands();
	const isCommandPaletteOpen = useIsCommandPaletteOpen();
	const [search, setSearch] = useState("");

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
		<ModalRoot
			open={isCommandPaletteOpen}
			onOpenChange={(isOpen) => {
				setIsCommandPaletteOpen(isOpen);
				setSearch("");
			}}
		>
			<ModalContent className="command-palette-modal">
				<CommandPalette
					search={search}
					onSearchChange={setSearch}
					onExecuteCommand={(commandId) => executeCommand(commandId)}
				/>
			</ModalContent>
		</ModalRoot>
	);
};
