import Sqlite from "better-sqlite3";
import { Kysely, SqliteDialect, ParseJSONResultsPlugin } from "kysely";
import { DB_PATH } from "./constants";
import type { Database } from "./types";

export async function getDb() {
	const sqlite = Sqlite(DB_PATH);

	const db = new Kysely<Database>({
		dialect: new SqliteDialect({
			database: sqlite,
		}),
		plugins: [new ParseJSONResultsPlugin()],
	});

	await db.schema
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
	getDb();
}
