import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { chatsRouter } from "./chats";

export const mainRouter = router({
	chats: chatsRouter,
});

export type MainRouter = typeof mainRouter;
export type MainRouterInputs = inferRouterInputs<MainRouter>;
export type MainRouterOutputs = inferRouterOutputs<MainRouter>;
