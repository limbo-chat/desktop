import { useMemo } from "react";
import { useToolStore } from "./stores";

export const useTools = () => {
	return useToolStore((state) => state.tools);
};

export const useTool = (toolId: string) => {
	const tools = useToolStore((state) => state.tools);

	return tools.get(toolId);
};

export const useToolList = () => {
	const tools = useToolStore((state) => state.tools);

	return useMemo(() => {
		return [...tools.values()];
	}, [tools]);
};
