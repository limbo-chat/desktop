import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMainRouter } from "../../../lib/trpc";
import { useWorkspaceStore } from "../stores";

export const useWorkspaceLoader = () => {
	const mainRouter = useMainRouter();

	const getWorkspaceQuery = useSuspenseQuery(mainRouter.workspace.get.queryOptions());
	const workspaceData = getWorkspaceQuery.data;

	useEffect(() => {
		if (!workspaceData) {
			return;
		}

		const workspaceStore = useWorkspaceStore.getState();

		workspaceStore.setWorkspace(workspaceData);
	}, [workspaceData]);
};
