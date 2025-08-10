import { useMemo, useState } from "react";
import type * as limbo from "@limbo/api";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import { AppIcon } from "../../../components/app-icon";
import { useLLMList } from "../hooks";

interface LLMPickerItemProps {
	llm: limbo.LLM;
	onSelect: () => void;
}

const LLMItem = ({ llm, onSelect }: LLMPickerItemProps) => {
	return (
		<Command.Item value={llm.id} className="llm-item" onSelect={onSelect}>
			<div className="llm-info">
				<div className="llm-name">{llm.name}</div>
			</div>
		</Command.Item>
	);
};

export interface LLMPickerProps {
	llms: limbo.LLM[];
	onChange: (value: string) => void;
}

export const LLMPicker = ({ llms, onChange }: LLMPickerProps) => {
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

	return (
		<Command className="llm-picker" loop shouldFilter={false}>
			<div className="llm-picker-search-container">
				<div className="llm-picker-search-icon">
					<AppIcon icon="search" />
				</div>
				<Command.Input
					className="llm-picker-search-input"
					placeholder="Search models..."
					value={search}
					onValueChange={setSearch}
				/>
			</div>
			<Command.List className="llm-picker-list">
				{filteredLLMs.map((llm) => (
					<LLMItem llm={llm} key={llm.id} onSelect={() => onChange(llm.id)} />
				))}
			</Command.List>
			<div className="llm-picker-footer">{/* todo */}</div>
		</Command>
	);
};

export interface RegisteredLLMPickerProps extends Omit<LLMPickerProps, "llms"> {}

export const RegisteredLLMPicker = (props: RegisteredLLMPickerProps) => {
	const llms = useLLMList();

	return <LLMPicker llms={llms} {...props} />;
};
