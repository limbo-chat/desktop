import { useEffect } from "react";
import { usePluginManager } from "../../plugins/hooks/core";
import { addTool, removeTool } from "../../tools/utils";
import { createGetModelsTool } from "./get-models";

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
