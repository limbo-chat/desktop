import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("chat")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("title", "text", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) => col.notNull())
		.ifNotExists()
		.execute();

	await db.schema
		.createTable("chat_message")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("chat_id", "integer", (col) =>
			col.references("chat.id").onDelete("cascade").notNull()
		)
		.addColumn("role", "text", (col) => col.notNull()) // e.g., user, assistant
		.addColumn("content", "text", (col) => col.notNull()) // The actual message content
		.addColumn("created_at", "timestamp", (col) => col.notNull())
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("chat_message").ifExists();
	await db.schema.dropTable("chat").ifExists();
}
