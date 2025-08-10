import { z } from "zod";
import { AUTH_REDIRECT_URI } from "../../auth/constants";
import {
	createOAuthClient,
	findOAuthToken,
	findOAuthClient,
	startOAuthTokenRequestSession,
	refreshOrDeleteAuthTokenIfNeeded,
	deleteExpiredOAuthTokenRequestSessions,
} from "../../auth/helpers/core";
import { registerClient } from "../../auth/helpers/oauth";
import { getDb } from "../../db/utils";
import { publicProcedure, router } from "../trpc";

export const startOAuthTokenRequestInputSchema = z.object({
	authUrl: z.string(),
	tokenUrl: z.string(),
	registrationUrl: z.string().optional(),
	clientId: z.string().optional(),
	clientName: z.string().optional(),
	scopes: z.array(z.string()),
});

export const authRouter = router({
	startOAuthTokenRequest: publicProcedure
		.input(startOAuthTokenRequestInputSchema)
		.mutation(async ({ input }) => {
			const db = await getDb();

			// clean up expired token request sessions on each of these requests
			await deleteExpiredOAuthTokenRequestSessions(db);

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
						clientName: input.clientName ?? "Limbo Desktop",
						redirectUris: [AUTH_REDIRECT_URI],
						scopes: input.scopes,
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

			// look for an existing token for this client and scopes
			const token = await findOAuthToken(db, {
				clientId: client.id,
				scopes: input.scopes,
			});

			if (token) {
				// this can return null if the token is expired and cannot be refreshed
				// in that case, we will want to start a new token request session
				const maybeRefreshedToken = await refreshOrDeleteAuthTokenIfNeeded(db, {
					client,
					token,
				});

				if (maybeRefreshedToken) {
					return {
						accessToken: maybeRefreshedToken.access_token,
					};
				}
			}

			// if no token exists, start a new token request session
			const result = await startOAuthTokenRequestSession(db, {
				client: client,
				scopes: input.scopes,
			});

			return {
				sessionId: result.sessionId,
				authUrl: result.authUrl.toString(),
			};
		}),
});
