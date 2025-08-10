import type { IpcMainInvokeEvent } from "electron";
import { initTRPC } from "@trpc/server";
import type { WindowManager } from "../windows/manager";

export interface TRPCContext {
	event: IpcMainInvokeEvent;
	windowManager: WindowManager;
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
