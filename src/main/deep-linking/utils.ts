import { endOAuthTokenRequestSession } from "../auth/helpers/core";
import { getDb } from "../db/utils";

async function handleAuthCallback(url: URL) {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (!code || !state) {
		console.error("Invalid deep link: missing code or state");

		return;
	}

	const sessionId = Number(state);

	if (isNaN(sessionId)) {
		console.error("Invalid deep link: state is not a valid session ID");

		return;
	}

	const db = await getDb();

	const tokenRequestSession = await db
		.selectFrom("oauth_token_request_session")
		.selectAll()
		.where("id", "=", sessionId)
		.executeTakeFirst();

	if (!tokenRequestSession) {
		console.error("Invalid deep link: session not found");

		return;
	}

	try {
		await endOAuthTokenRequestSession(db, {
			code: code,
			session: tokenRequestSession,
		});
	} catch (error) {
		console.error("Error handling OAuth callback:", error);
	}
}

export async function handleDeepLink(url: string) {
	const parsedUrl = new URL(url);
	const pathname = parsedUrl.pathname;

	switch (pathname) {
		case "/auth/callback":
			await handleAuthCallback(parsedUrl);
			break;
	}
}
