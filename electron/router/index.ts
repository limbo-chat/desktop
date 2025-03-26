import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { chatsRouter } from "./chats";
import { pluginsRouter } from "./plugins";

export const mainRouter = router({
	plugins: pluginsRouter,
	chats: chatsRouter,
});

export type MainRouter = typeof mainRouter;
export type MainRouterInputs = inferRouterInputs<MainRouter>;
export type MainRouterOutputs = inferRouterOutputs<MainRouter>;
