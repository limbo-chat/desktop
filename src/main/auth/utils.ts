import { AUTH_REDIRECT_URI } from "./constants";
import { dynamicClientRegistrationResponseSchema, tokenResponseSchema } from "./schemas";

export interface BuildAuthUrlOptions {
	authUrl: string;
	clientId: string;
	challenge: any;
	scopes?: string[];
}

export function buildAuthUrl(opts: BuildAuthUrlOptions): URL {
	const authUrl = new URL(opts.authUrl);

	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", opts.clientId);
	authUrl.searchParams.set("redirect_uri", "limbo://auth/callback");
	authUrl.searchParams.set("code_challenge", opts.challenge.code_challenge);
	authUrl.searchParams.set("code_challenge_method", "S256");

	if (opts.scopes && opts.scopes.length > 0) {
		authUrl.searchParams.set("scope", opts.scopes.join(" "));
	}

	return authUrl;
}

export interface RegisterClientOptions {
	registrationUrl: string;
	clientName: string;
}

export async function registerClient(opts: RegisterClientOptions) {
	const response = await fetch(opts.registrationUrl, {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			client_name: opts.clientName,
			redirect_uris: [AUTH_REDIRECT_URI],
			grant_types: ["authorization_code"],
			response_types: ["code"],
			token_endpoint_auth_method: "none",
		}),
	});

	const body = await response.json();
	const responseParseResult = dynamicClientRegistrationResponseSchema.safeParse(body);

	if (!responseParseResult.success) {
		throw new Error("Received invalid client registration response");
	}

	return responseParseResult.data;
}

export interface ExchangeCodeForAccessTokenOptions {
	code: string;
	clientId: string;
	tokenUrl: string;
	codeVerifier: string;
}

export async function exchangeCodeForAccessToken(opts: ExchangeCodeForAccessTokenOptions) {
	const params = new URLSearchParams();

	params.append("grant_type", "authorization_code");
	params.append("code", opts.code);
	params.append("redirect_uri", AUTH_REDIRECT_URI);
	params.append("client_id", opts.clientId);
	params.append("code_verifier", opts.codeVerifier);

	const response = await fetch(opts.tokenUrl, {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params.toString(),
	});

	const body = await response.json();
	const responseParseResult = tokenResponseSchema.safeParse(body);

	if (!responseParseResult.success) {
		throw new Error("Received invalid client registration response");
	}

	return responseParseResult.data;
}
