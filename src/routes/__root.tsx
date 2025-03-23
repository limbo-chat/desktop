import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MainRouterProvider } from "../lib/trpc";
import { useMemo } from "react";
import { ipcLink } from "trpc-electron/renderer";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { MainRouter } from "../../electron/router";
import "../styles/default-fonts.css";
import "../styles/default-theme.css";
import "../styles/tailwind.css";

export const Route = createRootRoute({
	component: RootLayout,
	beforeLoad: () => {
		return {
			queryClient: new QueryClient(),
		};
	},
});

function RootLayout() {
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

	return (
		<QueryClientProvider client={routerContext.queryClient}>
			<MainRouterProvider trpcClient={trpcClient} queryClient={routerContext.queryClient}>
				<Outlet />
			</MainRouterProvider>
		</QueryClientProvider>
	);
}
