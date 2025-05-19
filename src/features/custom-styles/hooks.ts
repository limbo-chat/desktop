import { useEffect } from "react";
import { addCustomStyle, removeCustomStyle } from "./utils";
import { useMainRouterClient } from "../../lib/trpc";

export interface UseCustomStylesLoaderOptions {
	onFinished?: () => void;
}

export const useCustomStylesLoader = (opts?: UseCustomStylesLoaderOptions) => {
	const mainRouterClient = useMainRouterClient();

	const loadCustomStyles = async () => {
		const customStylePaths = await mainRouterClient.customStyles.getPaths.query();

		const customStyles = await Promise.allSettled(
			customStylePaths.map(async (path) => {
				const styleContent = await mainRouterClient.customStyles.get.query({
					path,
				});

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

	useEffect(() => {
		loadCustomStyles();
	}, []);
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
