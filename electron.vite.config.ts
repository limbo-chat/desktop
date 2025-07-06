import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import path from "node:path";

const outDir = path.join(__dirname, "dist");
const srcDir = path.join(__dirname, "src");
const mainDir = path.join(srcDir, "main");
const preloadDir = path.join(srcDir, "preload");
const rendererDir = path.join(srcDir, "renderer");

export default defineConfig({
	main: {
		build: {
			outDir: path.join(outDir, "main"),
			rollupOptions: {
				input: path.join(mainDir, "main.ts"),
			},
		},
		plugins: [
			externalizeDepsPlugin({
				/*
					trpc-electron uses context bridge in the main process, this fails to build because electron doesn't export contextBridge in the main process
					adding it to be bundled here will allow the bundler to drop off the contextBridge import, which is not needed in the main process
				 */
				exclude: ["trpc-electron"],
			}),
		],
	},
	preload: {
		build: {
			outDir: path.join(outDir, "preload"),
			rollupOptions: {
				input: path.join(preloadDir, "main.ts"),
				output: {
					format: "cjs",
				},
			},
		},
		plugins: [
			externalizeDepsPlugin({
				exclude: ["trpc-electron"],
			}),
		],
	},
	renderer: {
		build: {
			outDir: path.join(outDir, "renderer"),
			rollupOptions: {
				input: path.join(rendererDir, "index.html"),
			},
		},
		plugins: [react()],
	},
});
