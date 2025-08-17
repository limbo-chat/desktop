import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { EmptyStateDescription, EmptyStateTitle } from "../../../components/empty-state";
import * as ListQuickPicker from "../../quick-picker/components/list-primitive";
import * as QuickPicker from "../../quick-picker/components/primitive";
import { useLLMList } from "../hooks";

export interface LLMPickerProps {
	initialSelectedLLMId: string | null;
	onSelect: (id: string) => void;
}

export const LLMPicker = ({ initialSelectedLLMId, onSelect }: LLMPickerProps) => {
	const [focusedLLMId, setFocusedLLMId] = useState<string | null>(null);
	const [selectedLLMId, setSelectedLLMId] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const llms = useLLMList();

	const fuse = useMemo(() => {
		return new Fuse(llms, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["id", "name", "description"],
		});
	}, [llms]);

	const filteredLLMs = useMemo(() => {
		if (!search) {
			return llms;
		}

		return fuse.search(search).map((item) => item.item);
	}, [search, llms]);

	const filteredLLMIds = useMemo(() => {
		return filteredLLMs.map((item) => item.id);
	}, [filteredLLMs]);

	const handleSelectedLLMIdChange = (selectedLLMId: string) => {
		setSelectedLLMId(selectedLLMId);
		onSelect(selectedLLMId);
	};

	useEffect(() => {
		setSelectedLLMId(initialSelectedLLMId);
	}, [initialSelectedLLMId]);

	return (
		<ListQuickPicker.Root
			className="llm-picker"
			items={filteredLLMIds}
			focusedId={focusedLLMId}
			selectedId={selectedLLMId}
			onFocusedIdChange={setFocusedLLMId}
			onSelectedIdChange={handleSelectedLLMIdChange}
		>
			<QuickPicker.Header>
				<QuickPicker.Search>
					<QuickPicker.SearchInput
						placeholder="Search models..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</QuickPicker.Search>
			</QuickPicker.Header>
			<QuickPicker.Content>
				{filteredLLMs.length > 0 ? (
					<ListQuickPicker.List>
						{filteredLLMs.map((item) => (
							<ListQuickPicker.ListItem
								item={{
									id: item.id,
									title: item.name,
									description: item.description,
								}}
								key={item.id}
							/>
						))}
					</ListQuickPicker.List>
				) : (
					<QuickPicker.EmptyState>
						<EmptyStateTitle>No models found</EmptyStateTitle>
						<EmptyStateDescription>Try another search</EmptyStateDescription>
					</QuickPicker.EmptyState>
				)}
			</QuickPicker.Content>
		</ListQuickPicker.Root>
	);
};
