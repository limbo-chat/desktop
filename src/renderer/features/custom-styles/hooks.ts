import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMainRouter, useMainRouterClient } from "../../lib/trpc";
import { addCommand, removeCommand } from "../commands/utils";
import { addCustomStyle, removeCustomStyle } from "./utils";

export interface UseCustomStylesLoaderOptions {
	onFinished?: () => void;
}

export const useCustomStylesLoader = (opts?: UseCustomStylesLoaderOptions) => {
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();
	const getCustomStylesPathsQuery = useQuery(mainRouter.customStyles.getPaths.queryOptions());
	const customStylesPaths = getCustomStylesPathsQuery.data;

	useEffect(() => {
		if (!customStylesPaths) {
			return;
		}

		const loadedPaths = new Set<string>();

		const loadCustomStyles = async () => {
			const customStyles = await Promise.allSettled(
				customStylesPaths.map(async (path) => {
					const styleContent = await mainRouterClient.customStyles.get.query({
						path,
					});

					loadedPaths.add(path);

					return {
						path,
						content: styleContent,
					};
				})
			);

			for (const customStyle of customStyles) {
				if (customStyle.status === "fulfilled") {
					addCustomStyle(customStyle.value.path, customStyle.value.content);
				}
			}

			if (opts?.onFinished) {
				opts.onFinished();
			}
		};

		loadCustomStyles();

		return () => {
			for (const path of loadedPaths) {
				removeCustomStyle(path);
			}
		};
	}, [customStylesPaths]);
};

export const useCustomStylesSubscriber = () => {
	const mainRouterClient = useMainRouterClient();

	useEffect(() => {
		const onCustomStylesAdd = async (_: any, path: string) => {
			const customStyleContent = await mainRouterClient.customStyles.get.query({
				path,
			});

			addCustomStyle(path, customStyleContent);
		};

		const onCustomStylesRemove = async (_: any, path: string) => {
			removeCustomStyle(path);
		};

		const onCustomStylesReload = async (_: any, path: string) => {
			const customStyleContent = await mainRouterClient.customStyles.get.query({
				path,
			});

			removeCustomStyle(path);
			addCustomStyle(path, customStyleContent);
		};

		window.ipcRenderer.on("custom-style:add", onCustomStylesAdd);
		window.ipcRenderer.on("custom-style:remove", onCustomStylesRemove);
		window.ipcRenderer.on("custom-style:reload", onCustomStylesReload);

		return () => {
			window.ipcRenderer.off("custom-style:add", onCustomStylesAdd);
			window.ipcRenderer.off("custom-style:remove", onCustomStylesRemove);
			window.ipcRenderer.off("custom-style:reload", onCustomStylesReload);
		};
	}, []);
};

export const useRegisterCustomStylesCommands = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		addCommand({
			id: "custom-styles:reload",
			name: "Reload custom styles",
			execute: () => {
				queryClient.resetQueries(mainRouter.customStyles.getPaths.queryFilter());
			},
		});

		return () => {
			removeCommand("custom-styles:reload");
		};
	}, []);
};
