import { z } from "zod";
import {
	createOAuthClient,
	findOAuthToken,
	findOAuthClient,
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

			let client = await findOAuthClient(db, {
				authUrl: input.authUrl,
				tokenUrl: input.tokenUrl,
				scopes: input.scopes,
			});

			if (!client) {
				let newRemoteClientId = input.clientId;

				if (!newRemoteClientId) {
					// try to register a new client
					if (!input.registrationUrl) {
						throw new Error("Cannot register OAuth client without registration URL");
					}

					const registeredOAuthClient = await registerClient({
						registrationUrl: input.registrationUrl,
						clientName: "Limbo Desktop", // TODO: use plugin provided name
					});

					newRemoteClientId = registeredOAuthClient.client_id;
				}

				client = await createOAuthClient(db, {
					remoteClientId: newRemoteClientId,
					authUrl: input.authUrl,
					tokenUrl: input.tokenUrl,
					scopes: input.scopes,
				});
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
