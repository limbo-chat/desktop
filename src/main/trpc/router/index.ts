import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { assistantsRouter } from "./assistants";
import { authRouter } from "./auth";
import { chatsRouter } from "./chats";
import { commonRouter } from "./common";
import { customStylesRouter } from "./custom-styles";
import { pluginsRouter } from "./plugins";
import { settingsRouter } from "./settings";
import { windowRouter } from "./window";
import { workspaceRouter } from "./workspace";

export const mainRouter = router({
	common: commonRouter,
	window: windowRouter,
	auth: authRouter,
	workspace: workspaceRouter,
	settings: settingsRouter,
	customStyles: customStylesRouter,
	plugins: pluginsRouter,
	chats: chatsRouter,
	assistants: assistantsRouter,
});

export type MainRouter = typeof mainRouter;
export type MainRouterInputs = inferRouterInputs<MainRouter>;
export type MainRouterOutputs = inferRouterOutputs<MainRouter>;
