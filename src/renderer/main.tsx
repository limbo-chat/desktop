import { QueryClient } from "@tanstack/react-query";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { WindowInfoProvider } from "./features/window-info/components";
import { useWindowInfoFromIpc } from "./features/window-info/hooks";
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

const App = () => {
	const windowInfo = useWindowInfoFromIpc();

	if (!windowInfo) {
		return null;
	}

	return (
		<WindowInfoProvider windowInfo={windowInfo}>
			<RouterProvider router={router} />;
		</WindowInfoProvider>
	);
};

createRoot(document.getElementById("root")!).render(<App />);
