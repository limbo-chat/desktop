import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { Suspense, useMemo, useRef, type PropsWithChildren } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Toaster } from "sonner";
import { ipcLink } from "trpc-electron/renderer";
import type { MainRouter } from "../main/trpc/router";
import type { PlatformName } from "../main/utils";
import type { WindowType } from "../main/windows/types";
import { Button } from "./components/button";
import {
	ErrorState,
	ErrorStateActions,
	ErrorStateDescription,
	ErrorStateTitle,
} from "./components/error-state";
import { LoadingState } from "./components/loading-state";
import { useActiveChatPanelStore } from "./features/chat-panels/stores";
import { useRegisterActiveChatCommands } from "./features/chat/hooks/use-register-active-chat-commands";
import { useOpenCommandPaletteHotkey, useRegisterCoreCommands } from "./features/commands/hooks";
import {
	useCustomStylesLoader,
	useCustomStylesSubscriber,
	useRegisterCustomStylesCommands,
} from "./features/custom-styles/hooks";
import { ModalHost } from "./features/modals/components";
import { showNotification } from "./features/notifications/utils";
import {
	PluginBackendProvider,
	PluginManagerProvider,
	PluginSystemProvider,
} from "./features/plugins/components/providers";
import { PluginAPIFactory } from "./features/plugins/core/plugin-api-factory";
import type { PluginBackend, SettingEntry } from "./features/plugins/core/plugin-backend";
import type { PluginEnvironment } from "./features/plugins/core/plugin-environment";
import { PluginManager } from "./features/plugins/core/plugin-manager";
import { EvalPluginModuleLoader } from "./features/plugins/core/plugin-module-loader";
import { PluginSystem } from "./features/plugins/core/plugin-system";
import { usePluginHotReloader, usePluginLoader } from "./features/plugins/hooks/core";
import { usePluginSyncLayer } from "./features/plugins/hooks/use-plugin-sync-layer";
import { WindowInfoProvider } from "./features/window-info/components";
import { useWindowInfoContext } from "./features/window-info/hooks";
import { Workspace } from "./features/workspace/components/workspace";
import { useWorkspaceLoader } from "./features/workspace/hooks/use-workspace-loader";
import { useWorkspacePersister } from "./features/workspace/hooks/use-workspace-persister";
import { useWorkspaceStore } from "./features/workspace/stores";
import { useIsAppFocused } from "./hooks/common";
import { MainRouterProvider } from "./lib/trpc";

console.log(window.env.DISCORD_INVITE_URL);

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
			getPluginSettings: async (pluginId) => {
				return (await mainRouterClient.plugins.getSettings.query({
					id: pluginId,
				})) as SettingEntry[];
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

	const pluginEnvironment = useMemo<PluginEnvironment>(() => {
		return {
			storage: {
				get: async (opts) => {
					return await mainRouterClient.plugins.getStorageValue.query({
						pluginId: opts.pluginId,
						key: opts.key,
					});
				},
				set: async (opts) => {
					return await mainRouterClient.plugins.setStorageValue.mutate({
						pluginId: opts.pluginId,
						key: opts.key,
						value: opts.value,
					});
				},
				remove: async (opts) => {
					return await mainRouterClient.plugins.removeStorageValue.mutate({
						pluginId: opts.pluginId,
						key: opts.key,
					});
				},
				clear: async (opts) => {
					return await mainRouterClient.plugins.clearStorage.mutate({
						pluginId: opts.pluginId,
					});
				},
			},
			database: {
				query: async (opts) => {
					return await mainRouterClient.plugins.executeDatabaseQuery.mutate({
						id: opts.pluginId,
						sql: opts.sql,
						params: opts.params,
					});
				},
			},
			chats: {
				get: async (chatId) => {
					return await mainRouterClient.chats.get.query({
						id: chatId,
					});
				},
				getMessages: async (opts) => {
					return await mainRouterClient.chats.messages.getMany.query(opts);
				},
				rename: async (chatId, newName) => {
					await mainRouterClient.chats.update.mutate({
						id: chatId,
						data: {
							name: newName,
						},
					});
				},
			},
			models: {
				getLLM: (llmId) => {
					return pluginManager.getLLM(llmId) ?? undefined;
				},
			},
			ui: {
				showNotification: ({ pluginId, notification }) => {
					const plugin = pluginManager.getPlugin(pluginId);

					if (!plugin) {
						return;
					}

					showNotification({
						level: notification.level,
						title: notification.title,
						message: notification.message,
						source: plugin.manifest.name,
					});
				},
				showChatPanel: (opts) => {
					const workspaceStore = useWorkspaceStore.getState();

					if (!workspaceStore.workspace?.activeChatId) {
						return;
					}

					const activeChatPanelStore = useActiveChatPanelStore.getState();

					activeChatPanelStore.setActiveChatPanel({
						id: opts.id,
						data: opts.data ?? null,
					});
				},
			},
		};
	}, []);

	const pluginAPIFactory = useMemo(() => {
		return new PluginAPIFactory({
			environment: pluginEnvironment,
		});
	}, []);

	const pluginSystem = useMemo(() => {
		return new PluginSystem({
			pluginManager,
			pluginBackend,
			pluginAPIFactory,
			pluginModuleLoader: new EvalPluginModuleLoader(),
			hostBridge: {
				onActivatePluginError: (pluginId, errorMsg) => {
					console.error(`Failed to activate plugin ${pluginId}: Error: ${errorMsg}`);

					showNotification({
						level: "error",
						title: "Failed to activate plugin",
						message: errorMsg ?? "Unknown error",
						source: pluginId,
					});
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

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<ErrorState>
			<ErrorStateTitle>Something went wrong</ErrorStateTitle>
			{error.message && <ErrorStateDescription>{error.message}</ErrorStateDescription>}
			<ErrorStateActions>
				<Button onClick={() => resetErrorBoundary()}>Try again</Button>
			</ErrorStateActions>
		</ErrorState>
	);
};

const WorkspaceContainer = () => {
	const isWorkspaceLoaded = useWorkspaceStore((state) => !!state.workspace);

	useWorkspaceLoader();
	useWorkspacePersister();

	if (!isWorkspaceLoaded) {
		return null;
	}

	return <Workspace />;
};

const AppContent = () => {
	const isAppFocused = useIsAppFocused();
	const windowInfo = useWindowInfoContext();

	useRendererLoader();
	useCustomStylesSubscriber();
	usePluginSyncLayer();
	usePluginLoader();
	usePluginHotReloader();

	useRegisterCoreCommands();
	useRegisterActiveChatCommands();
	useRegisterCustomStylesCommands();
	useOpenCommandPaletteHotkey();

	return (
		<div className="app" data-platform={windowInfo.platform} data-is-focused={isAppFocused}>
			<ModalHost />
			<Toaster />
			<QueryErrorResetBoundary>
				{(queryBoundary) => (
					<ErrorBoundary FallbackComponent={ErrorFallback} onReset={queryBoundary.reset}>
						<Suspense fallback={<LoadingState />}>
							<WorkspaceContainer />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
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
