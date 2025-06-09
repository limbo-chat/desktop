import { useMemo } from "react";
import { useToolStore } from "./stores";

export const useTools = () => {
	return useToolStore((state) => state.tools);
};

export const useTool = (toolId: string) => {
	const tools = useTools();

	return tools.get(toolId);
};

export const useToolList = () => {
	const tools = useTools();

	return useMemo(() => {
		return [...tools.values()];
	}, [tools]);
};
