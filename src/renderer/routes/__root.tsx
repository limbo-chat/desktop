import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { createTRPCClient } from "@trpc/client";
import { Suspense, useMemo, useRef, type PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { ipcLink } from "trpc-electron/renderer";
import type { MainRouter } from "../../main/trpc/router";
import {
	ErrorRoot,
	ErrorContainer,
	ErrorControl,
	ErrorDescription,
	ErrorInfo,
	ErrorTitle,
} from "../components/error";
import { Loading } from "../components/loading";
import { useOpenCommandPaletteHotkey, useRegisterCoreCommands } from "../features/commands/hooks";
import {
	useCustomStylesLoader,
	useCustomStylesSubscriber,
	useRegisterCustomStylesCommands,
} from "../features/custom-styles/hooks";
import { ModalHost } from "../features/modals/components";
import {
	PluginBackendProvider,
	PluginManagerProvider,
	PluginSystemProvider,
} from "../features/plugins/components/providers";
import type { PluginBackend } from "../features/plugins/core/plugin-backend";
import { PluginManager } from "../features/plugins/core/plugin-manager";
import { EvalPluginModuleLoader } from "../features/plugins/core/plugin-module-loader";
import { PluginSystem } from "../features/plugins/core/plugin-system";
import { usePluginHotReloader, usePluginLoader } from "../features/plugins/hooks/core";
import { usePluginSyncLayer } from "../features/plugins/hooks/use-plugin-sync-layer";
import { useWindowInfoContext } from "../features/window-info/hooks";
import { useIsAppFocused } from "../hooks/common";
import { MainRouterProvider } from "../lib/trpc";
import { SideDock } from "./-components/side-dock";
import { Titlebar } from "./-components/titlebar";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
	notFoundComponent: () => {
		return (
			<ErrorContainer>
				<ErrorRoot>
					<ErrorInfo>
						<ErrorTitle>Page not found</ErrorTitle>
						<ErrorDescription>
							The page you are looking for does not exist
						</ErrorDescription>
					</ErrorInfo>
				</ErrorRoot>
				<ErrorControl>
					<Link className="button" to="/chat">
						Return home
					</Link>
				</ErrorControl>
			</ErrorContainer>
		);
	},
});

function RootLayoutProviders({ children }: PropsWithChildren) {
	const ctx = Route.useRouteContext();

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
		<QueryClientProvider client={ctx.queryClient}>
			<MainRouterProvider trpcClient={mainRouterClient} queryClient={ctx.queryClient}>
				<PluginBackendProvider pluginBackend={pluginBackend}>
					<PluginSystemProvider pluginSystem={pluginSystem}>
						<PluginManagerProvider pluginManager={pluginManager}>
							{children}
						</PluginManagerProvider>
					</PluginSystemProvider>
				</PluginBackendProvider>
			</MainRouterProvider>
		</QueryClientProvider>
	);
}

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
			<div className="app-content">
				<SideDock />
				<div className="root-page">
					<Outlet />
				</div>
			</div>
		</>
	);
};

function RootLayout() {
	const windowInfo = useWindowInfoContext();
	const isAppFocused = useIsAppFocused();

	return (
		<RootLayoutProviders>
			<div className="app" data-platform={windowInfo.platform} data-is-focused={isAppFocused}>
				<ModalHost />
				<Toaster />
				<Suspense fallback={<Loading />}>
					<MainContent />
				</Suspense>
			</div>
		</RootLayoutProviders>
	);
}
