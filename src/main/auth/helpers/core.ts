import { addMinutes, isPast } from "date-fns";
import pkceChallenge from "pkce-challenge";
import type { AppDatabaseClient } from "../../db/types";
import { buildOAuthAuthorizationUrl, exchangeCodeForAccessToken } from "./oauth";

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
			.where("oauth_token_scope.scope", "in", opts.scopes);
	}

	const tokenResult = await getTokenQuery.executeTakeFirst();

	return tokenResult ?? null;
}

// core oauth flow

export interface StartOAuthTokenRequestOptions {}

export async function startOAuthTokenRequest(
	db: AppDatabaseClient,
	opts: StartOAuthTokenRequestOptions
) {
	// step 1: create the authentication url given the client id, redirect uri, scopes, state, code challenge, etc.
	const challenge = await pkceChallenge();

	const tokenRequestSession = await db
		.insertInto("oauth_token_request_session")
		.values({
			// TODO, get the values
			client_id: null,
			code_verifier: challenge.code_verifier,
			created_at: new Date().toISOString(),
		})
		.returningAll()
		.executeTakeFirst();

	if (!tokenRequestSession) {
		throw new Error("Failed to create OAuth token request session");
	}

	const authUrl = buildOAuthAuthorizationUrl({
		// TODO, fill in the values
		authUrl: null,
		clientId: null,
		scopes: [],
		state: tokenRequestSession.id.toString(),
		codeChallenge: challenge.code_challenge,
	});

	return {
		authUrl: authUrl.toString(),
		tokenRequestSession,
	};
}

export async function handleOAuthRedirect(db: AppDatabaseClient, uri: string) {
	const url = new URL(uri);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (!code || !state) {
		throw new Error("Missing code or state in OAuth redirect");
	}

	const tokenRequestSession = await db
		.selectFrom("oauth_token_request_session")
		.selectAll()
		.where("id", "=", Number(state))
		.executeTakeFirst();

	if (!tokenRequestSession) {
		throw new Error("OAuth token request session not found");
	}

	const tokenRequestSessionCreatedAt = new Date(tokenRequestSession.created_at);
	const tokenRequestSessionExpiresAt = addMinutes(tokenRequestSessionCreatedAt, 10);

	if (isPast(tokenRequestSessionExpiresAt)) {
		throw new Error("OAuth token request session has expired");
	}

	const client = await db
		.selectFrom("oauth_client")
		.selectAll()
		.where("id", "=", tokenRequestSession.client_id)
		.executeTakeFirst();

	if (!client) {
		throw new Error("OAuth client not found");
	}

	const provider = await db
		.selectFrom("oauth_provider")
		.selectAll()
		.where("id", "=", client.provider_id)
		.executeTakeFirst();

	if (!provider) {
		throw new Error("OAuth provider not found");
	}

	// Exchange the authorization code for an access token
	const tokenResponse = await exchangeCodeForAccessToken({
		code,
		clientId: client.remote_client_id,
		tokenUrl: provider.token_url,
		codeVerifier: tokenRequestSession.code_verifier,
	});

	return tokenResponse;
}
