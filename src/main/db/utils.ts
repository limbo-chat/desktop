import Sqlite from "better-sqlite3";
import { Kysely, SqliteDialect, ParseJSONResultsPlugin } from "kysely";
import { DB_PATH } from "./constants";
import type { AppDatabase, AppDatabaseClient } from "./types";

export async function getDb(): Promise<AppDatabaseClient> {
	const sqlite = Sqlite(DB_PATH);

	const db = new Kysely<AppDatabase>({
		dialect: new SqliteDialect({
			database: sqlite,
		}),
		plugins: [new ParseJSONResultsPlugin()],
	});

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
		.addColumn("description", "text", (col) => col.notNull())
		.addColumn("systemPrompt", "text", (col) => col.notNull())
		.addColumn("recommendedPlugins", "text", (col) => col.notNull())
		.addColumn("recommendedTools", "text", (col) => col.notNull());

	return db;
}

export async function ensureDb() {
	await getDb();
}
