import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { MainRouter } from "../../electron/router";

const mainRouterContext = createTRPCContext<MainRouter>();

export const MainProvider = mainRouterContext.TRPCProvider;
export const useMain = mainRouterContext.useTRPC;
export const useMainClient = mainRouterContext.useTRPCClient;
