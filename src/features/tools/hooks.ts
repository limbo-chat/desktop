import { useToolStore } from "./stores";

export const useTool = (toolId: string) => {
	const tools = useToolStore((state) => state.tools);

	return tools.get(toolId);
};
