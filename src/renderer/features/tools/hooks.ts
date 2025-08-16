import { useEffect, useMemo } from "react";
import { usePluginManager } from "../plugins/hooks/core";
import { createGetModelsTool } from "./core-tools/get-models";
import { useToolStore } from "./stores";
import { addTool, removeTool } from "./utils";

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

export const useRegisterCoreTools = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const getModelsTool = createGetModelsTool(pluginManager);

		addTool(getModelsTool);

		return () => {
			removeTool(getModelsTool.id);
		};
	}, [pluginManager]);
};
