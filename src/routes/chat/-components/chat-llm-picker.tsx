import Fuse from "fuse.js";
import { InfoIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../../components/button";
import { TextInput } from "../../../components/inputs/text-input";
import {
	MenuRoot,
	MenuTrigger,
	MenuPositioner,
	MenuContent,
	MenuItem,
} from "../../../components/menu";
import { Tooltip } from "../../../components/tooltip";
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
			keys: ["id", "name"],
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
				<MenuContent className="llm-picker">
					<div className="llm-picker-header">
						<TextInput
							placeholder="Search models..."
							leftSection={<SearchIcon />}
						></TextInput>
					</div>
					<div className="llm-picker-results">
						{filteredLLMs.map((llm) => {
							return (
								<MenuItem
									className="llm-picker-item"
									key={llm.id}
									value={llm.id}
									onClick={() => setSelectedChatLLMId(llm.id)}
								>
									<span>{llm.name}</span>
									<Tooltip
										label={llm.description}
										positioning={{ placement: "top" }}
									>
										<InfoIcon />
									</Tooltip>
								</MenuItem>
							);
						})}
					</div>
				</MenuContent>
			</MenuPositioner>
		</MenuRoot>
	);
};
