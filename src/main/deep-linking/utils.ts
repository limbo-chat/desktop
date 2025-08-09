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
		throw new Error("Invalid deep link: missing code or state");
	}

	const db = await getDb();

	const tokenRequestSession = await db
		.selectFrom("oauth_token_request_session")
		.selectAll()
		.where("id", "=", sessionId)
		.executeTakeFirst();

	if (!tokenRequestSession) {
		throw new Error("Invalid deep link: session not found");
	}

	try {
		const result = await endOAuthTokenRequestSession(db, {
			code: code,
			session: tokenRequestSession,
		});

		// send the result to the renderer
		windowManager.sendMessageToAllWindows("auth-session:token-granted", {
			sessionId: tokenRequestSession.id,
			accessToken: result.access_token,
		});
	} catch (error) {
		let errorMessage = "An unknown error occurred";

		if (error instanceof Error) {
			errorMessage = error.message;
		}

		windowManager.sendMessageToAllWindows("auth-session:error", {
			sessionId: tokenRequestSession.id,
			error: errorMessage,
		});
	}
}

const pathHandlers: Record<string, any> = {
	"/auth/callback": handleAuthCallback,
} as const;

export async function handleDeepLink(url: string, windowManager: WindowManager) {
	const parsedUrl = new URL(url);
	const pathname = parsedUrl.pathname;
	const handler = pathHandlers[pathname];

	if (!handler) {
		throw new Error(`No handler for deep link path: ${pathname}`);
	}

	await handler(parsedUrl, windowManager);
}
