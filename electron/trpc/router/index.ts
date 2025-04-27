import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { chatsRouter } from "./chats";
import { pluginsRouter } from "./plugins";
import { customStylesRouter } from "./custom-styles";

export const mainRouter = router({
	customStyles: customStylesRouter,
	plugins: pluginsRouter,
	chats: chatsRouter,
});

export type MainRouter = typeof mainRouter;
export type MainRouterInputs = inferRouterInputs<MainRouter>;
export type MainRouterOutputs = inferRouterOutputs<MainRouter>;
