import { initTRPC } from "@trpc/server";
import type { BrowserWindow } from "electron";
import superjson from "superjson";

export interface MainRouterContext {
	win: BrowserWindow;
}

const t = initTRPC.context<MainRouterContext>().create({
	transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
