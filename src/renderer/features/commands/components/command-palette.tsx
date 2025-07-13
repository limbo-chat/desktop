import Fuse from "fuse.js";
import { useMemo, useState } from "react";
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
import { useModalContext } from "../../modals/hooks";
import { showNotification } from "../../notifications/utils";
import { useCommandList, useCommands } from "../hooks";

export interface CommandPaletteProps {
	onExecuteCommand: (commandId: string) => void;
}

export const CommandPalette = ({ onExecuteCommand }: CommandPaletteProps) => {
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

	return (
		<SearchPrompt className="command-palette" label="Command palette" loop shouldFilter={false}>
			<SearchPromptInputContainer>
				<SearchPromptInput
					placeholder="Search commands..."
					value={search}
					onValueChange={setSearch}
				/>
			</SearchPromptInputContainer>
			<SearchPromptResults>
				{filteredCommands.length === 0 && <EmptyResult>No commands found</EmptyResult>}
				{filteredCommands.map((command) => (
					<ResultItem key={command.id} onSelect={() => onExecuteCommand(command.id)}>
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
