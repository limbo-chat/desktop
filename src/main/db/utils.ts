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
		.createTable("oauth_provider")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("issuer_url", "text", (col) => col.notNull())
		.addColumn("auth_url", "text", (col) => col.notNull())
		.addColumn("token_url", "text", (col) => col.notNull())
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("oauth_client")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("provider_id", "integer", (col) =>
			col.references("oauth_provider.id").onDelete("cascade")
		)
		.addColumn("remote_client_id", "text", (col) => col.notNull())
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("oauth_token")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("client_id", "integer", (col) =>
			col.references("oauth_client.id").onDelete("cascade")
		)
		.addColumn("access_token", "text", (col) => col.notNull())
		.addColumn("expires_at", "text", (col) => col.notNull())
		.addColumn("refresh_token", "text")
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("oauth_token_scope")
		.addColumn("token_id", "integer", (col) =>
			col.references("oauth_token.id").onDelete("cascade").notNull()
		)
		.addColumn("scope", "text", (col) => col.notNull())
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("oauth_token_request_session")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("client_id", "text", (col) => col.notNull().references("oauth_client.id"))
		.addColumn("code_verifier", "text", (col) => col.notNull())
		.addColumn("created_at", "text", (col) => col.notNull())
		.ifNotExists()
		.execute();

	await await db.schema
		.createTable("chat")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("userMessageDraft", "text")
		.addColumn("llmId", "text")
		.addColumn("enabledToolIds", "text", (col) => col.notNull())
		.addColumn("createdAt", "text", (col) => col.notNull())
		.addColumn("lastActivityAt", "text")
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("chatMessage")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("chatId", "text", (col) =>
			col.references("chat.id").onDelete("cascade").notNull()
		)
		.addColumn("role", "text", (col) => col.notNull()) // e.g., user, assistant
		.addColumn("content", "text", (col) => col.notNull())
		.addColumn("createdAt", "text", (col) => col.notNull())
		.ifNotExists()
		.execute();

	return db;
}

export async function ensureDb() {
	await getDb();
}
