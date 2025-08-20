import { Suspense, useMemo, useRef, type PropsWithChildren } from "react";
import {
	QueryClient,
	QueryClientProvider,
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { minutesToMilliseconds } from "date-fns";
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
import { useOpenCommandPaletteHotkey } from "./features/commands/hooks";
import { useRegisterCoreChatNodes } from "./features/core/chat-nodes/hooks";
import {
	useRegisterActiveChatCommands,
	useRegisterCoreCommands,
} from "./features/core/commands/hooks";
import { useRegisterCoreMarkdownElements } from "./features/core/markdown-elements/hooks";
import { useRegisterCoreTools } from "./features/core/tools/hooks";
import { useCustomStylesLoader, useCustomStylesSubscriber } from "./features/custom-styles/hooks";
import { showConfirmDialog } from "./features/interactions/confirm/utils";
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
import { PreferencesProvider } from "./features/preferences/components";
import { WindowInfoProvider } from "./features/window-info/components";
import { useWindowInfoContext } from "./features/window-info/hooks";
import { Workspace } from "./features/workspace/components/workspace";
import { useWorkspaceLoader } from "./features/workspace/hooks/use-workspace-loader";
import { useWorkspacePersister } from "./features/workspace/hooks/use-workspace-persister";
import { useWorkspaceStore } from "./features/workspace/stores";
import { useIsAppFocused } from "./hooks/common";
import { MainRouterProvider, useMainRouter } from "./lib/trpc";

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
					const chat = await mainRouterClient.chats.get.query({
						id: chatId,
					});

					if (!chat) {
						return null;
					}

					return {
						id: chat.id,
						name: chat.name,
						createdAt: chat.created_at,
					};
				},
				getMessages: async (opts) => {
					const messages = await mainRouterClient.chats.messages.getMany.query(opts);

					return messages.map((message) => ({
						id: message.id,
						content: message.content,
						createdAt: message.created_at,
						role: message.role,
					}));
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
				showConfirmDialog: async (opts) => {
					return await showConfirmDialog(opts);
				},
			},
			auth: {
				authenticate: async ({ pluginId, options }) => {
					const plugin = pluginManager.getPlugin(pluginId);

					if (!plugin) {
						throw new Error(
							`Plugin with ID ${pluginId} not found. This is likely a bug.`
						);
					}

					// look for an existing auth token
					const existingClient = await mainRouterClient.auth.findOAuthClient.query({
						authUrl: options.authUrl,
						tokenUrl: options.tokenUrl,
						scopes: options.scopes,
						remoteClientId: options.clientId,
					});

					if (existingClient) {
						const existingToken = await mainRouterClient.auth.findOAuthToken.query({
							clientId: existingClient.id,
							scopes: options.scopes,
						});

						// if an existing token is found, return that
						if (existingToken) {
							return existingToken.access_token;
						}
					}

					// otherwise, start a new auth session

					const origin = new URL(options.authUrl).origin;

					const confirmed = await showConfirmDialog({
						title: "Authentication required",
						description: `The plugin "${plugin.manifest.name}" is requesting to authenticate with ${origin.toString()}. Do you want to proceed?`,
					});

					if (!confirmed) {
						throw new Error("Authentication cancelled by user");
					}

					const response = await mainRouterClient.auth.startOAuthTokenRequest.mutate({
						authUrl: options.authUrl,
						tokenUrl: options.tokenUrl,
						registrationUrl: options.registrationUrl,
						clientId: options.clientId,
						clientName: options.clientName,
						scopes: options.scopes,
					});

					// open the auth URL in the browser
					await mainRouterClient.common.openUrl.mutate({
						url: response.authUrl,
					});

					// wait for the token request to complete
					return new Promise((resolve, reject) => {
						// if the request takes too long, reject with a timeout error
						const timeout = setTimeout(() => {
							removeListeners();
							reject(new Error("OAuth token request timed out"));
						}, minutesToMilliseconds(10));

						const removeListeners = () => {
							clearTimeout(timeout);

							window.ipcRenderer.off(
								"oauth-token-request:end",
								handleOAuthTokenRequestEnd
							);

							window.ipcRenderer.off(
								"oauth-token-request:error",
								handleOAuthTokenRequestError
							);
						};

						const handleOAuthTokenRequestEnd = (
							_event: any,
							{ sessionId, accessToken }: any
						) => {
							if (sessionId === response.sessionId) {
								removeListeners();
								resolve(accessToken);
							}
						};

						const handleOAuthTokenRequestError = (
							_event: any,
							{ sessionId, error }: any
						) => {
							if (sessionId === response.sessionId) {
								removeListeners();
								reject(new Error(error));
							}
						};

						window.ipcRenderer.on(
							"oauth-token-request:end",
							handleOAuthTokenRequestEnd
						);

						window.ipcRenderer.on(
							"oauth-token-request:error",
							handleOAuthTokenRequestError
						);
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
	const mainRouter = useMainRouter();
	const getPreferencesQuery = useSuspenseQuery(mainRouter.preferences.getAll.queryOptions());

	useRendererLoader();
	useCustomStylesSubscriber();
	usePluginSyncLayer();
	usePluginLoader();
	usePluginHotReloader();
	useOpenCommandPaletteHotkey();

	useRegisterCoreCommands();
	useRegisterActiveChatCommands();
	useRegisterCoreChatNodes();
	useRegisterCoreMarkdownElements();
	useRegisterCoreTools();

	return (
		<PreferencesProvider preferences={getPreferencesQuery.data}>
			<div className="app" data-platform={windowInfo.platform} data-is-focused={isAppFocused}>
				<ModalHost />
				<Toaster />
				<QueryErrorResetBoundary>
					{(queryBoundary) => (
						<ErrorBoundary
							FallbackComponent={ErrorFallback}
							onReset={queryBoundary.reset}
						>
							<Suspense fallback={<LoadingState />}>
								<WorkspaceContainer />
							</Suspense>
						</ErrorBoundary>
					)}
				</QueryErrorResetBoundary>
			</div>
		</PreferencesProvider>
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
