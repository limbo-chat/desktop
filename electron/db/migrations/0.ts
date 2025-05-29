import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("chat")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("createdAt", "timestamp", (col) => col.notNull())
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
		.addColumn("createdAt", "timestamp", (col) => col.notNull())
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("toolCall")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("toolId", "text", (col) => col.notNull())
		.addColumn("status", "text", (col) => col.notNull())
		.addColumn("arguments", "text", (col) => col.notNull())
		.addColumn("result", "text")
		.addColumn("error", "text");
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("chatMessage").ifExists();
	await db.schema.dropTable("chat").ifExists();
}
