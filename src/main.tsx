import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import "./styles/fonts.css";
import "./styles/theme.css";
import "./styles/globals.css";
import "./styles/tailwind.css";

// Import the generated route tree

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
