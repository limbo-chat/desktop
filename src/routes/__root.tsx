import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { createTRPCClient } from "@trpc/client";
import { Suspense, useMemo, useRef, type PropsWithChildren } from "react";
import { ipcLink } from "trpc-electron/renderer";
import type { MainRouter } from "../../electron/trpc/router";
import { useCustomStylesLoader, useCustomStylesSubscriber } from "../features/custom-styles/hooks";
import { PluginManagerContext } from "../features/plugins/contexts";
import { PluginManager } from "../features/plugins/core/plugin-manager";
import { usePluginHotReloader, usePluginLoader } from "../features/plugins/hooks";
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

const useRendererLoader = () => {
	const areCutomStylesLoaded = useRef(false);

	const checkLoaded = () => {
		if (!areCutomStylesLoaded.current) {
			return;
		}

		// notify the main process that the renderer is ready
		window.ipcRenderer.send("renderer:ready");
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

	usePluginLoader();
	usePluginHotReloader();

	return (
		<div className="app-row">
			<SideDock />
			<div className="app-content">
				<Outlet />
			</div>
		</div>
	);
};

function RootLayout() {
	const appIsFocused = useIsAppFocused();

	return (
		<RootLayoutProviders>
			<div className="app" data-app-focused={appIsFocused}>
				<Titlebar />
				<Suspense fallback={"loading, todo replace"}>
					<MainContent />
				</Suspense>
			</div>
		</RootLayoutProviders>
	);
}
