import { addMinutes, addSeconds, isFuture, isPast, subMinutes } from "date-fns";
import pkceChallenge from "pkce-challenge";
import type {
	AppDatabaseClient,
	OAuthClient,
	OAuthToken,
	OAuthTokenRequestSession,
} from "../../db/types";
import { TOKEN_REFRESH_THRESHOLD_MINUTES } from "../constants";
import {
	buildOAuthAuthorizationUrl,
	exchangeCodeForAccessToken,
	InvalidRefreshTokenError,
	refreshAccessToken,
} from "./oauth";

export interface FindOAuthClientOptions {
	authUrl: string;
	tokenUrl: string;
	scopes?: string[];
}

export async function findOAuthClient(db: AppDatabaseClient, opts: FindOAuthClientOptions) {
	const getClientQuery = await db
		.selectFrom("oauth_client")
		.selectAll()
		.where("auth_url", "=", opts.authUrl)
		.where("token_url", "=", opts.tokenUrl);

	if (opts.scopes) {
		getClientQuery
			.innerJoin("oauth_client_scope", "oauth_client.id", "oauth_client_scope.client_id")
			.where("oauth_client_scope.scope", "in", opts.scopes)
			.having((eb) => eb.fn.count("oauth_client_scope.scope"), "=", opts.scopes.length);
	}

	const client = await getClientQuery.executeTakeFirst();

	return client ?? null;
}

export interface FindAccessTokenOptions {
	clientId: number;
	scopes?: string[];
}

export async function findOAuthToken(db: AppDatabaseClient, opts: FindAccessTokenOptions) {
	const getTokenQuery = await db
		.selectFrom("oauth_token")
		.selectAll()
		.where("client_id", "=", opts.clientId);

	if (opts.scopes && opts.scopes.length > 0) {
		getTokenQuery
			.innerJoin("oauth_token_scope", "oauth_token.id", "oauth_token_scope.token_id")
			.where("oauth_token_scope.scope", "in", opts.scopes)
			.having((eb) => eb.fn.count("oauth_token_scope.scope"), "=", opts.scopes.length);
	}

	const tokenResult = await getTokenQuery.executeTakeFirst();

	return tokenResult ?? null;
}

export interface CreateOAuthClientOptions {
	authUrl: string;
	tokenUrl: string;
	remoteClientId: string;
	scopes: string[];
}

export async function createOAuthClient(db: AppDatabaseClient, opts: CreateOAuthClientOptions) {
	const newClient = await db
		.insertInto("oauth_client")
		.values({
			auth_url: opts.authUrl,
			token_url: opts.tokenUrl,
			remote_client_id: opts.remoteClientId,
			created_at: new Date().toISOString(),
		})
		.returningAll()
		.executeTakeFirst();

	if (!newClient) {
		throw new Error("Failed to create OAuth client");
	}

	const newScopes = opts.scopes.map((scope) => ({
		client_id: newClient.id,
		scope,
	}));

	await db.insertInto("oauth_client_scope").values(newScopes).execute();

	return newClient;
}

export interface CreateOAuthTokenOptions {
	clientId: number;
	accessToken: string;
	refreshToken?: string;
	expiresAt: Date;
	scopes: string[];
}

export async function createOAuthToken(db: AppDatabaseClient, opts: CreateOAuthTokenOptions) {
	const newToken = await db
		.insertInto("oauth_token")
		.values({
			client_id: opts.clientId,
			access_token: opts.accessToken,
			refresh_token: opts.refreshToken,
			expires_at: opts.expiresAt.toISOString(),
		})
		.returningAll()
		.executeTakeFirst();

	if (!newToken) {
		throw new Error("Failed to create OAuth token");
	}

	const newScopes = opts.scopes.map((scope) => ({
		token_id: newToken.id,
		scope,
	}));

	await db.insertInto("oauth_token_scope").values(newScopes).execute();

	return newToken;
}

export interface CreateTokenRequestSessionOptions {
	clientId: number;
	codeVerifier: string;
}

export async function createTokenRequestSession(
	db: AppDatabaseClient,
	opts: CreateTokenRequestSessionOptions
) {
	const tokenRequestSession = await db
		.insertInto("oauth_token_request_session")
		.values({
			client_id: opts.clientId,
			code_verifier: opts.codeVerifier,
			created_at: new Date().toISOString(),
		})
		.returningAll()
		.executeTakeFirst();

	if (!tokenRequestSession) {
		throw new Error("Failed to create OAuth token request session");
	}

	return tokenRequestSession;
}

// core oauth flow

export interface RefreshOAuthTokenOptions {
	token: OAuthToken;
	client: OAuthClient;
}

export async function refreshOAuthToken(
	db: AppDatabaseClient,
	{ token, client }: RefreshOAuthTokenOptions
) {
	if (!token.refresh_token) {
		throw new Error("OAuth token does not have a refresh token");
	}

	const result = await refreshAccessToken({
		clientId: client.remote_client_id,
		refreshToken: token.refresh_token,
		tokenUrl: client.token_url,
	});

	const expiresAt = addSeconds(new Date(), result.expires_in);

	const updatedToken = await db
		.updateTable("oauth_token")
		.set({
			access_token: result.access_token,
			refresh_token: result.refresh_token, // a refresh token may be returned
			expires_at: expiresAt.toISOString(),
		})
		.where("id", "=", token.id)
		.returningAll()
		.executeTakeFirst();

	if (!updatedToken) {
		throw new Error("Failed to update OAuth token");
	}

	return updatedToken;
}

export interface RefreshOAuthTokenIfNeededOptions {
	client: OAuthClient;
	token: OAuthToken;
}

export async function refreshOrDeleteAuthTokenIfNeeded(
	db: AppDatabaseClient,
	{ client, token }: RefreshOAuthTokenIfNeededOptions
): Promise<OAuthToken | null> {
	const tokenExpiresAt = new Date(token.expires_at);
	const refreshThreshold = subMinutes(tokenExpiresAt, TOKEN_REFRESH_THRESHOLD_MINUTES);

	if (isFuture(refreshThreshold)) {
		// Token is still valid beyond the threshold, no need to refresh
		return token;
	}

	// if there is no refresh token, we cannot refresh the token
	if (!token.refresh_token) {
		await db.deleteFrom("oauth_token").where("id", "=", token.id).execute();

		return null;
	}

	try {
		return await refreshOAuthToken(db, { token, client });
	} catch (error) {
		if (error instanceof InvalidRefreshTokenError) {
			// If the refresh token is invalid, delete the token
			await db.deleteFrom("oauth_token").where("id", "=", token.id).execute();

			return null;
		}

		throw error; // rethrow other errors
	}
}

export interface StartOAuthTokenRequestSessionOptions {
	client: OAuthClient;
	scopes: string[];
}

export async function startOAuthTokenRequestSession(
	db: AppDatabaseClient,
	{ client, scopes }: StartOAuthTokenRequestSessionOptions
) {
	const challenge = await pkceChallenge();

	const tokenRequestSession = await createTokenRequestSession(db, {
		clientId: client.id,
		codeVerifier: challenge.code_verifier,
	});

	const authUrl = buildOAuthAuthorizationUrl({
		authUrl: client.auth_url,
		clientId: client.remote_client_id,
		redirectUri: "limbo://auth/callback",
		state: tokenRequestSession.id.toString(),
		codeChallenge: challenge.code_challenge,
		scopes,
	});

	return {
		sessionId: tokenRequestSession.id,
		authUrl: authUrl.toString(),
	};
}

export interface EndOAuthTokenRequestSessionOptions {
	session: OAuthTokenRequestSession;
	code: string;
}

export async function endOAuthTokenRequestSession(
	db: AppDatabaseClient,
	{ session, code }: EndOAuthTokenRequestSessionOptions
) {
	const tokenRequestSessionCreatedAt = new Date(session.created_at);
	const tokenRequestSessionExpiresAt = addMinutes(tokenRequestSessionCreatedAt, 10);

	if (isPast(tokenRequestSessionExpiresAt)) {
		throw new Error("OAuth token request session has expired");
	}

	const client = await db
		.selectFrom("oauth_client")
		.selectAll()
		.where("id", "=", session.client_id)
		.executeTakeFirst();

	if (!client) {
		throw new Error("OAuth client not found");
	}

	// Exchange the authorization code for an access token
	const tokenResponse = await exchangeCodeForAccessToken({
		code,
		clientId: client.remote_client_id,
		tokenUrl: client.token_url,
		codeVerifier: session.code_verifier,
	});

	// delete the token request session
	await db.deleteFrom("oauth_token_request_session").where("id", "=", session.id).execute();

	return tokenResponse;
}
