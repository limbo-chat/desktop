import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { MainRouterProvider } from "../lib/trpc";
import { Suspense, useMemo, type PropsWithChildren } from "react";
import { ipcLink } from "trpc-electron/renderer";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { MainRouter } from "../../electron/router";
import { PluginController } from "../features/plugins/components/plugin-controller";
import { PluginManagerProvider } from "../features/plugins/components/plugin-manager-provider";
import { PluginManager } from "../features/plugins/core/plugin-manager";
import { useLLMChunkSubscriber } from "../features/chat/hooks";

import "../styles/default-fonts.css";
import "../styles/default-theme.css";
import "../styles/tailwind.css";

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: () => {
		return (
			<div>
				<p>not found</p>
				<Link to="/chat">home</Link>
			</div>
		);
	},
	beforeLoad: () => {
		return {
			queryClient: new QueryClient(),
		};
	},
});

function RootLayoutProviders({ children }: PropsWithChildren) {
	const routerContext = Route.useRouteContext();

	const trpcClient = useMemo(() => {
		return createTRPCClient<MainRouter>({
			links: [
				ipcLink({
					transformer: superjson,
				}),
			],
		});
	}, []);

	const pluginManager = useMemo(() => {
		return new PluginManager();
	}, []);

	useLLMChunkSubscriber();

	return (
		<QueryClientProvider client={routerContext.queryClient}>
			<MainRouterProvider trpcClient={trpcClient} queryClient={routerContext.queryClient}>
				<PluginManagerProvider pluginManager={pluginManager}>
					{children}
				</PluginManagerProvider>
			</MainRouterProvider>
		</QueryClientProvider>
	);
}

function RootLayout() {
	return (
		<RootLayoutProviders>
			<Suspense fallback={<div>Loading...</div>}>
				<PluginController />
				<Outlet />
			</Suspense>
		</RootLayoutProviders>
	);
}
