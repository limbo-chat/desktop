import { useMemo } from "react";
import { useLLMStore } from "./stores";

export const useLLMs = () => {
	return useLLMStore((state) => state.llms);
};

export const useLLM = (id: string) => {
	const llms = useLLMs();

	return llms.get(id);
};

export const useMaybeLLM = (id: string | null) => {
	const llms = useLLMs();

	if (!id) {
		return undefined;
	}

	return llms.get(id);
};

export const useLLMList = () => {
	const llms = useLLMs();

	return useMemo(() => {
		return [...llms.values()];
	}, [llms]);
};
