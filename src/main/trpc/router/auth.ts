import { z } from "zod";
import { AUTH_REDIRECT_URI } from "../../auth/constants";
import {
	createOAuthClient,
	findOAuthToken,
	findOAuthClient,
	startOAuthTokenRequestSession,
	refreshOrDeleteAuthTokenIfNeeded,
	deleteExpiredOAuthTokenRequestSessions,
	getOAuthClient,
} from "../../auth/helpers/core";
import { registerClient } from "../../auth/helpers/oauth";
import { getDb } from "../../db/utils";
import { publicProcedure, router } from "../trpc";

export const findOAuthClientInputSchema = z.object({
	authUrl: z.string(),
	tokenUrl: z.string(),
	scopes: z.array(z.string()),
	remoteClientId: z.string().optional(),
});

export const findOAuthTokenInputSchema = z.object({
	clientId: z.number(),
	scopes: z.array(z.string()),
});

export const startOAuthTokenRequestInputSchema = z.object({
	authUrl: z.string(),
	tokenUrl: z.string(),
	registrationUrl: z.string().optional(),
	clientId: z.string().optional(),
	clientName: z.string().optional(),
	scopes: z.array(z.string()),
});

export const authRouter = router({
	findOAuthClient: publicProcedure.input(findOAuthClientInputSchema).query(async ({ input }) => {
		const db = await getDb();

		const client = await findOAuthClient(db, {
			authUrl: input.authUrl,
			tokenUrl: input.tokenUrl,
			scopes: input.scopes,
			remoteClientId: input.remoteClientId,
		});

		return client ?? null;
	}),
	findOAuthToken: publicProcedure.input(findOAuthTokenInputSchema).query(async ({ input }) => {
		const db = await getDb();

		const client = await getOAuthClient(db, input.clientId);

		if (!client) {
			return null;
		}

		let token = await findOAuthToken(db, {
			clientId: input.clientId,
			scopes: input.scopes,
		});

		if (token) {
			// this can return null if the token is expired and cannot be refreshed
			token = await refreshOrDeleteAuthTokenIfNeeded(db, {
				client,
				token,
			});
		}

		return token ?? null;
	}),
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
				remoteClientId: input.clientId,
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
