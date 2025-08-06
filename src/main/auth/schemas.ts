import { z } from "zod";

export const wellKnownOAuthConfigSchema = z.object({
	issuer: z.string(),
	authorization_endpoint: z.string(),
	token_endpoint: z.string(),
	registration_endpoint: z.string().optional(),
});

// note: there may be other fields in the response that are not included here, we only care about these
// https://datatracker.ietf.org/doc/html/rfc7591
export const dynamicClientRegistrationResponseSchema = z.object({
	client_id: z.string(),
	client_id_issued_at: z.number().optional(), // we don't care about this, but it's part of the spec
});

export const tokenResponseSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	refresh_token: z.string().optional(),
});
