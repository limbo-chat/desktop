import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { EmptyStateDescription, EmptyStateTitle } from "../../../components/empty-state";
import { useMainRouter } from "../../../lib/trpc";
import * as ListQuickPicker from "../../quick-picker/components/list-primitive";
import * as QuickPicker from "../../quick-picker/components/primitive";

export interface AssistantPickerProps {
	initialSelectedAssistantId: string | null;
	onSelect: (id: string) => void;
}

export const AssistantPicker = ({ initialSelectedAssistantId, onSelect }: AssistantPickerProps) => {
	const [focusedAssistantId, setFocusedAssistantId] = useState<string | null>(null);
	const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	const mainRouter = useMainRouter();
	const getAssistantsQuery = useQuery(mainRouter.assistants.getAll.queryOptions());

	const assistants = getAssistantsQuery.data ?? [];
	const isLoading = getAssistantsQuery.isLoading;

	const fuse = useMemo(() => {
		return new Fuse(assistants, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["id", "name", "description"],
		});
	}, [assistants]);

	const filteredAssistants = useMemo(() => {
		if (!search) {
			return assistants;
		}

		return fuse.search(search).map((item) => item.item);
	}, [search, assistants]);

	const filteredAssistantIds = useMemo(() => {
		return filteredAssistants.map((item) => item.id);
	}, [filteredAssistants]);

	const handleSelectedAssistantIdChange = (selectedLLMId: string) => {
		setSelectedAssistantId(selectedLLMId);
		onSelect(selectedLLMId);
	};

	useEffect(() => {
		setSelectedAssistantId(initialSelectedAssistantId);
	}, [initialSelectedAssistantId]);

	return (
		<ListQuickPicker.Root
			className="assistant-picker"
			isLoading={isLoading}
			items={filteredAssistantIds}
			focusedId={focusedAssistantId}
			selectedId={selectedAssistantId}
			onFocusedIdChange={setFocusedAssistantId}
			onSelectedIdChange={handleSelectedAssistantIdChange}
		>
			<QuickPicker.Header>
				<QuickPicker.Search>
					<QuickPicker.SearchInput
						placeholder="Search assistants..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</QuickPicker.Search>
			</QuickPicker.Header>
			<QuickPicker.Content>
				{isLoading && <QuickPicker.LoadingBar />}
				{filteredAssistantIds.length > 0 && (
					<ListQuickPicker.List>
						{filteredAssistants.map((item) => (
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
				)}
				{!isLoading && filteredAssistantIds.length === 0 && (
					<QuickPicker.EmptyState>
						<EmptyStateTitle>No assistants found</EmptyStateTitle>
						<EmptyStateDescription>
							Try another search, or create a new assistant
						</EmptyStateDescription>
					</QuickPicker.EmptyState>
				)}
			</QuickPicker.Content>
		</ListQuickPicker.Root>
	);
};
