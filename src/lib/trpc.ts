import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { MainRouter } from "../../electron/router";

const mainRouterContext = createTRPCContext<MainRouter>();

export const MainRouterProvider = mainRouterContext.TRPCProvider;
export const useMainRouter = mainRouterContext.useTRPC;
export const useMainRouterClient = mainRouterContext.useTRPCClient;
