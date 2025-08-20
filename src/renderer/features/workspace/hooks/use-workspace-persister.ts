import { useEffect } from "react";
import { debounce } from "es-toolkit";
import type { Workspace } from "../../../../main/workspace/schemas";
import { useMainRouterClient } from "../../../lib/trpc";
import { useWorkspaceStore } from "../stores";

export const useWorkspacePersister = () => {
	const mainRouterClient = useMainRouterClient();

	useEffect(() => {
		const saveWorkspace = debounce((workspace: Workspace) => {
			mainRouterClient.workspace.set.mutate(workspace);
		}, 500);

		const unsubscribe = useWorkspaceStore.subscribe((state) => {
			if (!state.workspace) {
				return;
			}

			saveWorkspace(state.workspace);
		});

		return () => {
			unsubscribe();
			saveWorkspace.flush();
		};
	}, []);
};
