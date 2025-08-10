import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["**/*.test.{ts,tsx}"],
		projects: [
			{
				extends: true,
				root: "./src/main",
				test: {
					name: "main-process",
					environment: "node",
				},
			},
			{
				extends: true,
				root: "./src/renderer",
				test: {
					name: "renderer-process",
					environment: "jsdom",
					setupFiles: ["./setup-tests.ts"],
				},
			},
		],
	},
});
