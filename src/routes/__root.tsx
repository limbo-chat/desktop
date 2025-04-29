import { type QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { MainRouterProvider, useMainRouter, useMainRouterClient } from "../lib/trpc";
import { Suspense, useMemo, type PropsWithChildren } from "react";
import { ipcLink } from "trpc-electron/renderer";
import { createTRPCClient } from "@trpc/client";
import type { MainRouter } from "../../electron/trpc/router";
import { PluginController } from "../features/plugins/components/plugin-controller";
import { PluginManager } from "../features/plugins/core/plugin-manager";
import { SideDock } from "./-components/side-dock";
import { Titlebar } from "./-components/titlebar";
import { useIsAppFocused } from "../hooks/common";
import { PluginManagerContext } from "../features/plugins/contexts";
import { CustomStylesController } from "../features/custom-styles/components";
import clsx from "clsx";
import { updateChatInQueryCache } from "../features/chat/utils";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
	notFoundComponent: () => {
		return (
			<div>
				<p>not found</p>
				<Link to="/chat">home</Link>
			</div>
		);
	},
});

const PluginManagerProvider = ({ children }: PropsWithChildren) => {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();
	const mainRouterClient = useMainRouterClient();

	const pluginManager = useMemo(() => {
		return new PluginManager({
			hostBridge: {
				getPluginData: async (pluginId: string) => {
					return await mainRouterClient.plugins.getPlugin.query({
						id: pluginId,
					});
				},
				showNotification: (notification) => {
					console.log("showNotification called from plugin");
				},
				renameChat: async (chatId: string, newName: string) => {
					const updatedChat = await mainRouterClient.chats.rename.mutate({
						id: chatId,
						name: newName,
					});

					updateChatInQueryCache(queryClient, mainRouter, updatedChat);
				},
				getChat: async (chatId: string) => {
					return await mainRouterClient.chats.get.query({ id: chatId });
				},
				getChatMessages: async (opts) => {
					return await mainRouterClient.chats.messages.getMany.query(opts);
				},
			},
		});
	}, []);

	return <PluginManagerContext value={pluginManager}>{children}</PluginManagerContext>;
};

function RootLayoutProviders({ children }: PropsWithChildren) {
	const ctx = Route.useRouteContext();

	const mainRouterClient = useMemo(() => {
		return createTRPCClient<MainRouter>({
			links: [ipcLink()],
		});
	}, []);

	return (
		<QueryClientProvider client={ctx.queryClient}>
			<MainRouterProvider trpcClient={mainRouterClient} queryClient={ctx.queryClient}>
				<PluginManagerProvider>{children}</PluginManagerProvider>
			</MainRouterProvider>
		</QueryClientProvider>
	);
}

function RootLayout() {
	const appIsFocused = useIsAppFocused();

	return (
		<RootLayoutProviders>
			<div className="app" data-app-focused={appIsFocused}>
				<Titlebar />
				<Suspense fallback={"loading, todo replace"}>
					<CustomStylesController />
					<PluginController />
					<div className="app-row">
						<SideDock />
						<div className="app-content">
							<Outlet />
						</div>
					</div>
				</Suspense>
			</div>
		</RootLayoutProviders>
	);
}
