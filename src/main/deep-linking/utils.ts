import { endOAuthTokenRequestSession } from "../auth/helpers/core";
import { getDb } from "../db/utils";
import type { WindowManager } from "../windows/manager";

async function handleAuthCallback(url: URL, windowManager: WindowManager) {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (!code || !state) {
		throw new Error("Invalid deep link: missing code or state");
	}

	const sessionId = Number(state);

	if (isNaN(sessionId)) {
		throw new Error("Invalid session ID in state");
	}

	const db = await getDb();

	const tokenRequestSession = await db
		.selectFrom("oauth_token_request_session")
		.selectAll()
		.where("id", "=", sessionId)
		.executeTakeFirst();

	if (!tokenRequestSession) {
		throw new Error("OAuth token request session not found");
	}

	try {
		const result = await endOAuthTokenRequestSession(db, {
			code: code,
			session: tokenRequestSession,
		});

		// send the result to the renderer
		windowManager.sendMessageToAllWindows("oauth-token-request:end", {
			sessionId: tokenRequestSession.id,
			accessToken: result.access_token,
		});
	} catch (error) {
		let errorMessage = "An unknown error occurred";

		if (error instanceof Error) {
			errorMessage = error.message;
		}

		windowManager.sendMessageToAllWindows("oauth-token-request:error", {
			sessionId: tokenRequestSession.id,
			error: errorMessage,
		});
	}
}

const actionHandlers: Record<string, any> = {
	"auth/callback": handleAuthCallback,
} as const;

export async function handleDeepLink(url: string, windowManager: WindowManager) {
	const parsedUrl = new URL(url);
	const actionName = `${parsedUrl.hostname}/${parsedUrl.pathname}`;
	const handler = actionHandlers[actionName];

	if (!handler) {
		throw new Error(`No handler for deep link: ${actionName}`);
	}

	await handler(parsedUrl, windowManager);
}
