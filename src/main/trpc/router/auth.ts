import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const startOAuthTokenRequestInputSchema = z.object({
	authUrl: z.string().url(),
	clientId: z.string(),
	scopes: z.array(z.string()).optional(),
});

export const authRouter = router({
	startOAuthTokenRequest: publicProcedure
		.input(startOAuthTokenRequestInputSchema)
		.mutation(async () => {
			// return {
			// 	authUrl: authUrl.toString(),
			// 	tokenRequestSessionId: tokenRequestSession.id,
			// };
		}),
});
