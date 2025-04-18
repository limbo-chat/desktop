import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

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
