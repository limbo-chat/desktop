import { QueryClient } from "@tanstack/react-query";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import type { PlatformName } from "../main/utils";
import type { WindowType } from "../main/windows/types";
import { WindowInfoProvider } from "./features/window-info/components";
import { routeTree } from "./route-tree.gen";

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	history: createMemoryHistory(),
	context: {
		queryClient,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const windowParams = new URLSearchParams(window.location.search);

const type = windowParams.get("type") as WindowType;
const platform = windowParams.get("platform") as PlatformName;

const App = () => {
	return (
		<WindowInfoProvider windowInfo={{ type, platform }}>
			<RouterProvider router={router} />;
		</WindowInfoProvider>
	);
};

createRoot(document.getElementById("root")!).render(<App />);
