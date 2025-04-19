import type { Insertable, Selectable } from "kysely";

export interface ChatTable {
	id: string;
	title: string;
	created_at: string;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;

export interface ChatMessageTable {
	id: string;
	chat_id: string;
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
