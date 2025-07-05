import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { Suspense, useMemo, useRef, type PropsWithChildren } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { ipcLink } from "trpc-electron/renderer";
import type { MainRouter } from "../main/trpc/router";
import type { PlatformName } from "../main/utils";
import type { WindowType } from "../main/windows/types";
import { Loading } from "./components/loading";
import { useOpenCommandPaletteHotkey, useRegisterCoreCommands } from "./features/commands/hooks";
import {
	useCustomStylesLoader,
	useCustomStylesSubscriber,
	useRegisterCustomStylesCommands,
} from "./features/custom-styles/hooks";
import { ModalHost } from "./features/modals/components";
import {
	PluginBackendProvider,
	PluginManagerProvider,
	PluginSystemProvider,
} from "./features/plugins/components/providers";
import type { PluginBackend } from "./features/plugins/core/plugin-backend";
import { PluginManager } from "./features/plugins/core/plugin-manager";
import { EvalPluginModuleLoader } from "./features/plugins/core/plugin-module-loader";
import { PluginSystem } from "./features/plugins/core/plugin-system";
import { usePluginHotReloader, usePluginLoader } from "./features/plugins/hooks/core";
import { usePluginSyncLayer } from "./features/plugins/hooks/use-plugin-sync-layer";
import { WindowInfoProvider } from "./features/window-info/components";
import { useWindowInfoContext } from "./features/window-info/hooks";
import { SideDock } from "./features/workspace/components/side-dock";
import { Titlebar } from "./features/workspace/components/titlebar";
import { useIsAppFocused } from "./hooks/common";
import { MainRouterProvider } from "./lib/trpc";

// parse the window params defined from the main process
const windowParams = new URLSearchParams(window.location.search);
const type = windowParams.get("type") as WindowType;
const platform = windowParams.get("platform") as PlatformName;

const useRendererLoader = () => {
	const windowInfo = useWindowInfoContext();
	const areCutomStylesLoaded = useRef(false);

	const checkLoaded = () => {
		if (!areCutomStylesLoaded.current) {
			return;
		}

		// notify the main process that the renderer is ready
		window.ipcRenderer.send("window:ready", windowInfo.type);
	};

	useCustomStylesLoader({
		onFinished: () => {
			areCutomStylesLoaded.current = true;

			checkLoaded();
		},
	});
};

const AppProviders = ({ children }: PropsWithChildren) => {
	const queryClient = useMemo(() => {
		return new QueryClient();
	}, []);

	const mainRouterClient = useMemo(() => {
		return createTRPCClient<MainRouter>({
			links: [ipcLink()],
		});
	}, []);

	const pluginManager = useMemo(() => {
		return new PluginManager();
	}, []);

	const pluginBackend = useMemo<PluginBackend>(() => {
		return {
			getPlugin: async (pluginId) => {
				return await mainRouterClient.plugins.get.query({
					id: pluginId,
				});
			},
			getAllPlugins: async () => {
				return await mainRouterClient.plugins.getAll.query();
			},
			enablePlugin: async (pluginId) => {
				return await mainRouterClient.plugins.updateEnabled.mutate({
					id: pluginId,
					enabled: true,
				});
			},
			disablePlugin: async (pluginId) => {
				return await mainRouterClient.plugins.updateEnabled.mutate({
					id: pluginId,
					enabled: false,
				});
			},
			updatePluginSettings: async (pluginId, settings) => {
				return await mainRouterClient.plugins.updateSettings.mutate({
					id: pluginId,
					settings,
				});
			},
			uninstallPlugin: async (pluginId) => {
				return await mainRouterClient.plugins.uninstall.mutate({
					id: pluginId,
				});
			},
		};
	}, []);

	const pluginSystem = useMemo(() => {
		return new PluginSystem({
			pluginManager,
			pluginModuleLoader: new EvalPluginModuleLoader(),
			hostBridge: {
				onActivatePluginError: (pluginId, errorMsg) => {
					console.error(`Failed to activate plugin ${pluginId}: Error: ${errorMsg}`);
				},
			},
			pluginAPIBridge: {
				getChat: async (chatId) => {
					return await mainRouterClient.chats.get.query({
						id: chatId,
					});
				},
				// @ts-expect-error, types are actually correct, some trpc incompatibility for some reason
				getChatMessages: async (opts) => {
					return await mainRouterClient.chats.messages.getMany.query(opts);
				},
				renameChat: async (chatId, newName) => {
					await mainRouterClient.chats.rename.mutate({
						id: chatId,
						name: newName,
					});
				},
				showNotification: async (notification) => {
					// todo show notification for real
				},
			},
		});
	}, []);

	return (
		<WindowInfoProvider windowInfo={{ type, platform }}>
			<QueryClientProvider client={queryClient}>
				<MainRouterProvider trpcClient={mainRouterClient} queryClient={queryClient}>
					<PluginBackendProvider pluginBackend={pluginBackend}>
						<PluginSystemProvider pluginSystem={pluginSystem}>
							<PluginManagerProvider pluginManager={pluginManager}>
								{children}
							</PluginManagerProvider>
						</PluginSystemProvider>
					</PluginBackendProvider>
				</MainRouterProvider>
			</QueryClientProvider>
		</WindowInfoProvider>
	);
};

const MainContent = () => {
	useRendererLoader();
	useCustomStylesSubscriber();

	usePluginSyncLayer();
	usePluginLoader();
	usePluginHotReloader();

	useRegisterCoreCommands();
	useRegisterCustomStylesCommands();
	useOpenCommandPaletteHotkey();

	return (
		<>
			<Titlebar />
			<div className="main-content">
				<SideDock />
			</div>
		</>
	);
};

const AppContent = () => {
	const isAppFocused = useIsAppFocused();
	const windowInfo = useWindowInfoContext();

	return (
		<div className="app" data-platform={windowInfo.platform} data-is-focused={isAppFocused}>
			<ModalHost />
			<Toaster />
			<Suspense fallback={<Loading />}>
				<MainContent />
			</Suspense>
		</div>
	);
};

const App = () => {
	return (
		<AppProviders>
			<AppContent />
		</AppProviders>
	);
};

createRoot(document.getElementById("root")!).render(<App />);
