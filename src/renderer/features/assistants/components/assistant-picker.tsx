import { useMemo, useState } from "react";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import type { Assistant } from "../../../../main/assistants/schemas";
import { AppIcon } from "../../../components/app-icon";
import { EmptyState, EmptyStateTitle } from "../../../components/empty-state";

interface AssistantItemProps {
	assistant: Assistant;
	isActive: boolean;
	onSelect: () => void;
}

const AssistantItem = ({ assistant, isActive, onSelect }: AssistantItemProps) => {
	return (
		<Command.Item
			className="assistant-item"
			value={assistant.id}
			data-is-active={isActive || undefined}
			onSelect={onSelect}
		>
			<div className="assistant-item-name">{assistant.name}</div>
		</Command.Item>
	);
};

export interface AssistantPickerProps {
	assistants: Assistant[];
	value?: string;
	onChange: (id: string) => void;
}

export const AssistantPicker = ({ assistants, value, onChange }: AssistantPickerProps) => {
	const [search, setSearch] = useState("");

	const fuse = useMemo(() => {
		return new Fuse(assistants, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["id", "name"],
		});
	}, [assistants]);

	const filteredAssistants = useMemo(() => {
		if (!search) {
			return assistants;
		}

		return fuse.search(search).map((item) => item.item);
	}, [fuse, search, assistants]);

	return (
		<Command className="assistant-picker" loop shouldFilter={false} value={value}>
			<div className="assistant-picker-search-container">
				<div className="assistant-picker-search-icon">
					<AppIcon icon="search" />
				</div>
				<Command.Input
					className="assistant-picker-search-input"
					placeholder="Search assistants..."
					value={search}
					onValueChange={setSearch}
				/>
			</div>
			<Command.List className="assistant-picker-list">
				{filteredAssistants.length > 0 ? (
					assistants.map((assistant) => (
						<AssistantItem
							assistant={assistant}
							isActive={value === assistant.id}
							onSelect={() => onChange(assistant.id)}
							key={assistant.id}
						/>
					))
				) : (
					<EmptyState>
						<EmptyStateTitle>No assistants found</EmptyStateTitle>
					</EmptyState>
				)}
			</Command.List>
		</Command>
	);
};
