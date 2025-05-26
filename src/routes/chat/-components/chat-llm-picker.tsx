import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Button } from "../../../components/button";
import {
	MenuRoot,
	MenuTrigger,
	MenuPositioner,
	MenuContent,
	MenuItem,
} from "../../../components/menu";
import { TextInput } from "../../../components/text-input";
import { useLLMList, useLLMs } from "../../../features/llms/hooks";
import { useSelectedChatLLMId } from "../../../features/storage/hooks";
import { setSelectedChatLLMId } from "../../../features/storage/utils";

// TODO, make sure this component has a clear structure in the styling system
export const ChatLLMPicker = () => {
	const llms = useLLMList();
	const llmMap = useLLMs();
	const selectedChatLLMId = useSelectedChatLLMId();
	const [search, setSearch] = useState("");

	const fuse = useMemo(() => {
		return new Fuse(llms, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["llm.id", "llm.name"],
		});
	}, [llms]);

	const filteredLLMs = useMemo(() => {
		if (!search) {
			return llms;
		}

		return fuse.search(search).map((item) => item.item);
	}, [fuse, search, llms]);

	const selectedLLM = useMemo(() => {
		if (!selectedChatLLMId) {
			return null;
		}

		return llmMap.get(selectedChatLLMId);
	}, [selectedChatLLMId, llmMap]);

	return (
		<MenuRoot>
			<MenuTrigger asChild>
				<Button variant="ghost" color="secondary">
					{selectedLLM ? selectedLLM.name : "Select model"}
				</Button>
			</MenuTrigger>
			<MenuPositioner>
				<MenuContent>
					<TextInput
						placeholder="Search models..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div>
						{filteredLLMs.map((llm) => {
							return (
								<MenuItem
									key={llm.id}
									value={llm.id}
									onClick={() => setSelectedChatLLMId(llm.id)}
								>
									{llm.name}
								</MenuItem>
							);
						})}
					</div>
				</MenuContent>
			</MenuPositioner>
		</MenuRoot>
	);
};
