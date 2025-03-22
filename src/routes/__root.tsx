import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { MainProvider } from "../lib/trpc";
import { useMemo } from "react";
import { ipcLink } from "trpc-electron/renderer";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";
import type { MainRouter } from "../../electron/router";
import "../styles/fonts.css";
import "../styles/theme.css";
import "../styles/globals.css";
import "../styles/tailwind.css";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
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
			<MainProvider trpcClient={trpcClient} queryClient={routerContext.queryClient}>
				<Outlet />
			</MainProvider>
		</QueryClientProvider>
	);
}
