import { publicProcedure, router } from "../trpc";

export const onboardingRouter = router({
	complete: publicProcedure.mutation(({ ctx }) => {
		const onboardingWindow = ctx.windowManager.getWindow("onboarding");

		// this should always be a BrowserWindow, but just in case
		if (onboardingWindow) {
			onboardingWindow.close();
		}

		ctx.windowManager.createMainWindow();
	}),
});
