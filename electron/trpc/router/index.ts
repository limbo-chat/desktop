import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { chatsRouter } from "./chats";
import { customStylesRouter } from "./custom-styles";
import { pluginsRouter } from "./plugins";
import { toolCallsRouter } from "./tool-calls";

export const mainRouter = router({
	customStyles: customStylesRouter,
	plugins: pluginsRouter,
	chats: chatsRouter,
	toolCalls: toolCallsRouter,
});

export type MainRouter = typeof mainRouter;
export type MainRouterInputs = inferRouterInputs<MainRouter>;
export type MainRouterOutputs = inferRouterOutputs<MainRouter>;
