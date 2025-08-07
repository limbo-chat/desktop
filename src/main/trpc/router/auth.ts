import { z } from "zod";
import {
	createOAuthClient,
	findOAuthClientByProvider,
	findOAuthToken,
	findOrCreateOAuthProvider,
	startOAuthTokenRequestSession,
} from "../../auth/helpers/core";
import { registerClient } from "../../auth/helpers/oauth";
import { getDb } from "../../db/utils";
import { publicProcedure, router } from "../trpc";

export const startOAuthTokenRequestInputSchema = z.object({
	issuerUrl: z.string(),
	authUrl: z.string(),
	tokenUrl: z.string(),
	registrationUrl: z.string().optional(),
	clientId: z.string().optional(),
	scopes: z.array(z.string()).optional(),
});

export const authRouter = router({
	startOAuthTokenRequest: publicProcedure
		.input(startOAuthTokenRequestInputSchema)
		.mutation(async ({ input }) => {
			const db = await getDb();

			const provider = await findOrCreateOAuthProvider(db, {
				issuerUrl: input.issuerUrl,
				authUrl: input.authUrl,
				tokenUrl: input.tokenUrl,
				registrationUrl: input.registrationUrl,
			});

			let client = await findOAuthClientByProvider(db, {
				providerId: provider.id,
				scopes: input.scopes,
			});

			if (client) {
			}

			if (!client) {
				if (input.clientId) {
					// use the provided client ID to make a new client
					client = await createOAuthClient(db, {
						providerId: provider.id,
						remoteClientId: input.clientId,
					});
				} else {
					// attempt to register a new client
					if (!provider.registration_url) {
						throw new Error("Cannot register OAuth client without registration URL");
					}

					const registeredOAuthClient = await registerClient({
						registrationUrl: provider.registration_url,
						clientName: "Limbo Desktop", // TODO: use plugin provided name
					});

					client = await createOAuthClient(db, {
						providerId: provider.id,
						remoteClientId: registeredOAuthClient.client_id,
						scopes: input.scopes,
					});
				}
			}

			const token = await findOAuthToken(db, {
				clientId: client.id,
				scopes: input.scopes,
			});

			if (token) {
				return {
					accessToken: token.access_token,
				};
			}

			const result = await startOAuthTokenRequestSession(db, {
				clientId: client.id,
				scopes: input.scopes,
			});

			return {
				sessionId: result.sessionId,
				authUrl: result.authUrl.toString(),
			};
		}),
});
