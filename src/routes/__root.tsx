import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { MainRouterProvider } from "../lib/trpc";
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

	const mainRouterClient = useMemo(() => {
		return createTRPCClient<MainRouter>({
			links: [ipcLink()],
		});
	}, []);

	const pluginManager = useMemo(() => {
		return new PluginManager();
	}, []);

	return (
		<QueryClientProvider client={ctx.queryClient}>
			<MainRouterProvider trpcClient={mainRouterClient} queryClient={ctx.queryClient}>
				<PluginManagerContext value={pluginManager}>{children}</PluginManagerContext>
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
