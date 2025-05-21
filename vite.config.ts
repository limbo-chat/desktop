import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
	plugins: [
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		electron({
			main: {
				entry: "electron/main.ts",
			},
			preload: {
				input: path.join(__dirname, "electron/preload.ts"),
			},
		}),
	],
});
