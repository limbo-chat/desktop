import { initTRPC } from "@trpc/server";
import type { BrowserWindow } from "electron";

export interface MainRouterContext {
	win: BrowserWindow;
}

const t = initTRPC.context<MainRouterContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
