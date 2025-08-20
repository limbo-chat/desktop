import type { Kysely } from "kysely";

/*
The migration map should be used to bring the previous version to the current version.

* The only migrations that will be included in the map will be LATEST_DATA_VERSION - 1 *

Lets say the current version is 2, but the user has version 1:
The only migration that needs to be run is migration 1 to bring the user from version 1 to version 2.

If the user has version 1, but the current version is 3:
The migrations that need to be run are 1 and 2 to bring the user from version 1 to version 3.
*/

export type MigrationMap = Record<number, (db: Kysely<any>) => Promise<void>>;

export const migrations: MigrationMap = {
	0: async (db) => {
		await db.schema
			.createTable("kv")
			.addColumn("key", "text", (col) => col.primaryKey())
			.addColumn("value", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("preference")
			.addColumn("key", "text", (col) => col.primaryKey())
			.addColumn("value", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("oauth_client")
			.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
			.addColumn("remote_client_id", "text", (col) => col.notNull())
			.addColumn("auth_url", "text", (col) => col.notNull())
			.addColumn("token_url", "text", (col) => col.notNull())
			.addColumn("created_at", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("oauth_client_scope")
			.addColumn("client_id", "integer", (col) =>
				col.notNull().references("oauth_client.id").onDelete("cascade")
			)
			.addColumn("scope", "text", (col) => col.notNull())
			.addPrimaryKeyConstraint("oauth_client_scope_pk", ["client_id", "scope"])
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("oauth_token")
			.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
			.addColumn("client_id", "integer", (col) =>
				col.notNull().references("oauth_client.id").onDelete("cascade")
			)
			.addColumn("access_token", "text", (col) => col.notNull())
			.addColumn("expires_at", "text", (col) => col.notNull())
			.addColumn("refresh_token", "text")
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("oauth_token_scope")
			.addColumn("token_id", "integer", (col) =>
				col.notNull().references("oauth_token.id").onDelete("cascade")
			)
			.addColumn("scope", "text", (col) => col.notNull())
			.addPrimaryKeyConstraint("oauth_token_scope_pk", ["token_id", "scope"])
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("oauth_token_request_session")
			.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
			.addColumn("client_id", "integer", (col) =>
				col.notNull().references("oauth_client.id").onDelete("cascade")
			)
			.addColumn("code_verifier", "text", (col) => col.notNull())
			.addColumn("created_at", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("oauth_token_request_session_scope")
			.addColumn("request_session_id", "integer", (col) =>
				col.notNull().references("oauth_token_request_session.id").onDelete("cascade")
			)
			.addColumn("scope", "text", (col) => col.notNull())
			.addPrimaryKeyConstraint("oauth_token_request_session_scope_pk", [
				"request_session_id",
				"scope",
			])
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("chat")
			.addColumn("id", "text", (col) => col.primaryKey())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("user_message_draft", "text")
			.addColumn("assistant_id", "text")
			.addColumn("llm_id", "text")
			.addColumn("enabled_tool_ids", "text", (col) => col.notNull())
			.addColumn("created_at", "text", (col) => col.notNull())
			.addColumn("last_activity_at", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("chat_message")
			.addColumn("id", "text", (col) => col.primaryKey())
			.addColumn("chat_id", "text", (col) =>
				col.references("chat.id").onDelete("cascade").notNull()
			)
			.addColumn("role", "text", (col) => col.notNull()) // e.g., user, assistant
			.addColumn("content", "text", (col) => col.notNull())
			.addColumn("created_at", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();

		await db.schema
			.createTable("assistant")
			.addColumn("id", "text", (col) => col.primaryKey())
			.addColumn("name", "text", (col) => col.notNull())
			.addColumn("tagline", "text", (col) => col.notNull())
			.addColumn("description", "text", (col) => col.notNull())
			.addColumn("system_prompt", "text", (col) => col.notNull())
			.addColumn("recommended_plugins", "text", (col) => col.notNull())
			.addColumn("recommended_tools", "text", (col) => col.notNull())
			.ifNotExists()
			.execute();
	},
} as const;
