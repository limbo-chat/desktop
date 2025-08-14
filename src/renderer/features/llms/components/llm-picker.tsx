import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import * as ListQuickPicker from "../../quick-picker/components/list-primitive";
import * as QuickPicker from "../../quick-picker/components/primitive";
import { useLLMList } from "../hooks";

export interface LLMPickerProps {
	selectedLLMId: string | null;
	onSelect: (id: string) => void;
}

export const LLMPicker = ({ selectedLLMId, onSelect }: LLMPickerProps) => {
	const llms = useLLMList();
	const [search, setSearch] = useState("");

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

	return (
		<ListQuickPicker.Root
			className="llm-picker"
			items={filteredLLMIds}
			selectedItemId={selectedLLMId}
			onSelect={onSelect}
		>
			<QuickPicker.Split>
				<QuickPicker.Master>
					<QuickPicker.Header>
						<QuickPicker.Search
							placeholder="Search models..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</QuickPicker.Header>
					<QuickPicker.Content>
						<ListQuickPicker.List>
							{filteredLLMs.map((item) => (
								<ListQuickPicker.ListItem
									item={{
										id: item.id,
										title: item.name,
										description: item.description,
										icon: null,
									}}
									key={item.id}
								/>
							))}
						</ListQuickPicker.List>
					</QuickPicker.Content>
				</QuickPicker.Master>
			</QuickPicker.Split>
		</ListQuickPicker.Root>
	);
};
