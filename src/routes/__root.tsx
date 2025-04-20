import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { MainRouterProvider } from "../lib/trpc";
import { Suspense, useMemo, type PropsWithChildren } from "react";
import { ipcLink } from "trpc-electron/renderer";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { MainRouter } from "../../electron/trpc/router";
import { PluginController } from "../features/plugins/components/plugin-controller";
import { PluginManagerProvider } from "../features/plugins/components/plugin-manager-provider";
import { PluginManager } from "../features/plugins/core/plugin-manager";
import { SideDock } from "./-components/side-dock";
import { Titlebar } from "./-components/titlebar";
import { useIsAppFocused } from "../hooks/common";
import clsx from "clsx";

import "../styles/preflight.css";
import "../styles/default-fonts.css";
import "../styles/default-theme.css";
import "./styles.scss";

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

function RootLayoutProviders({ children }: PropsWithChildren) {
	const ctx = Route.useRouteContext();

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

	return (
		<QueryClientProvider client={ctx.queryClient}>
			<MainRouterProvider trpcClient={trpcClient} queryClient={ctx.queryClient}>
				<PluginManagerProvider pluginManager={pluginManager}>
					{children}
				</PluginManagerProvider>
			</MainRouterProvider>
		</QueryClientProvider>
	);
}

function RootLayout() {
	const appIsFocused = useIsAppFocused();

	return (
		<RootLayoutProviders>
			<div className={clsx("app", appIsFocused && "app-focused")}>
				<Titlebar />
				<Suspense fallback={"loading, todo replace"}>
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
