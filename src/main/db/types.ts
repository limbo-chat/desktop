import type { Data } from "electron";
import type { Generated, Insertable, JSONColumnType, Kysely, Selectable } from "kysely";
import type { ChatMessageNode } from "@limbo/api";

export interface OAuthProviderTable {
	id: Generated<number>;
	issuer_url: string;
	auth_url: string;
	token_url: string;
}

export type OAuthProvider = Selectable<OAuthProviderTable>;
export type NewOAuthProvider = Insertable<OAuthProviderTable>;

export interface OAuthClientTable {
	id: Generated<number>;
	provider_id: number;
	remote_client_id: string;
}

export type OAuthClient = Selectable<OAuthClientTable>;
export type NewOAuthClient = Insertable<OAuthClientTable>;

export interface OAuthTokenTable {
	id: Generated<number>;
	client_id: number;
	access_token: string;
	refresh_token: string | null;
	expires_at: string | null;
}

export type OAuthToken = Selectable<OAuthTokenTable>;
export type NewOAuthToken = Insertable<OAuthTokenTable>;

export interface OAuthTokenScopeTable {
	token_id: number;
	scope: string;
}

export type OAuthTokenScope = Selectable<OAuthTokenScopeTable>;
export type NewOAuthTokenScope = Insertable<OAuthTokenScopeTable>;

export interface OAuthTokenRequestSessionTable {
	id: Generated<number>;
	client_id: number;
	code_verifier: string;
	created_at: string;
}

export type OAuthTokenRequestSession = Selectable<OAuthTokenRequestSessionTable>;
export type NewOAuthTokenRequestSession = Insertable<OAuthTokenRequestSessionTable>;

export interface ChatTable {
	id: string;
	name: string;
	userMessageDraft: string | null;
	llmId: string | null;
	enabledToolIds: JSONColumnType<string[]>;
	createdAt: string;
	lastActivityAt: string | null;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;

export interface ChatMessageTable {
	id: string;
	chatId: string;
	role: "user" | "assistant";
	content: JSONColumnType<ChatMessageNode[]>;
	createdAt: string;
}

export type ChatMessage = Selectable<ChatMessageTable>;
export type NewChatMessage = Insertable<ChatMessageTable>;

export interface AppDatabase {
	oauth_provider: OAuthProviderTable;
	oauth_client: OAuthClientTable;
	oauth_token: OAuthTokenTable;
	oauth_token_scope: OAuthTokenScopeTable;
	oauth_token_request_session: OAuthTokenRequestSessionTable;
	chat: ChatTable;
	chatMessage: ChatMessageTable;
}

export type AppDatabaseClient = Kysely<AppDatabase>;
