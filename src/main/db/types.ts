import type { ChatMessageNode } from "@limbo/api";
import type { Generated, Insertable, JSONColumnType, Kysely, Selectable } from "kysely";

export interface OAuthClientTable {
	id: Generated<number>;
	remote_client_id: string;
	auth_url: string;
	token_url: string;
	// consider adding revocation_url in the future
	created_at: string;
}

export type OAuthClient = Selectable<OAuthClientTable>;
export type NewOAuthClient = Insertable<OAuthClientTable>;

export interface OAuthClientScopeTable {
	client_id: number;
	scope: string;
}

export type OAuthClientScope = Selectable<OAuthClientScopeTable>;
export type NewOAuthClientScope = Insertable<OAuthClientScopeTable>;

export interface OAuthTokenTable {
	id: Generated<number>;
	client_id: number;
	access_token: string;
	refresh_token: string | null;
	expires_at: string;
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

export interface OAuthTokenRequestSessionScopeTable {
	request_session_id: number;
	scope: string;
}

export type OAuthTokenRequestSessionScope = Selectable<OAuthTokenRequestSessionScopeTable>;
export type NewOAuthTokenRequestSessionScope = Insertable<OAuthTokenRequestSessionScopeTable>;

export interface ChatTable {
	id: string;
	name: string;
	user_message_draft: string | null;
	llm_id: string | null;
	enabled_tool_ids: JSONColumnType<string[]>;
	created_at: string;
	last_activity_at: string;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;

export interface ChatMessageTable {
	id: string;
	chat_id: string;
	role: "user" | "assistant";
	content: JSONColumnType<ChatMessageNode[]>;
	created_at: string;
}

export type ChatMessage = Selectable<ChatMessageTable>;
export type NewChatMessage = Insertable<ChatMessageTable>;

export interface AssistantTable {
	id: string;
	name: string;
	description: string;
	systemPrompt: string;
	recommendedPlugins: JSONColumnType<string[]>;
	recommendedTools: JSONColumnType<string[]>;
}

export interface AssistantTable {
	id: string;
	name: string;
	description: string;
	recommendedPlugins: JSONColumnType<string[]>;
	recommendedTools: JSONColumnType<string[]>;
}

export interface AppDatabase {
	oauth_client: OAuthClientTable;
	oauth_client_scope: OAuthClientScopeTable;
	oauth_token: OAuthTokenTable;
	oauth_token_scope: OAuthTokenScopeTable;
	oauth_token_request_session: OAuthTokenRequestSessionTable;
	oauth_token_request_session_scope: OAuthTokenRequestSessionScopeTable;
	chat: ChatTable;
	chat_message: ChatMessageTable;
	assistant: AssistantTable;
}

export type AppDatabaseClient = Kysely<AppDatabase>;
