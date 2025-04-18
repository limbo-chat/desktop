import type { Generated, Insertable, Selectable } from "kysely";

export interface ChatTable {
	id: Generated<number>;
	title: string;
	created_at: string;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;

export interface ChatMessageTable {
	id: Generated<number>;
	chat_id: number;
	role: "user" | "assistant";
	content: string;
	created_at: string;
}

export type ChatMessage = Selectable<ChatMessageTable>;
export type NewChatMessage = Insertable<ChatMessageTable>;

export interface Database {
	chat: ChatTable;
	chat_message: ChatMessageTable;
}
