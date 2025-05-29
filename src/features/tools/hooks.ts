import { useMemo } from "react";
import { useToolStore, useToolCallStore } from "./stores";

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

export const useToolCall = (toolCallId: string) => {
	return useToolCallStore((state) => state.toolCalls.get(toolCallId));
};
