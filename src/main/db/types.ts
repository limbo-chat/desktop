import type { Insertable, JSONColumnType, Selectable } from "kysely";
import type { ChatMessageNode } from "@limbo/api";

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

export interface Database {
	chat: ChatTable;
	chatMessage: ChatMessageTable;
}
