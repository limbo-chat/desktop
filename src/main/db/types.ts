import type { Insertable, Selectable } from "kysely";

export interface ChatTable {
	id: string;
	name: string;
	createdAt: string;
	userMessageDraft: string | null;
	llmId: string | null;
	enabledToolIds: string;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;

export interface ChatMessageTable {
	id: string;
	chatId: string;
	role: "user" | "assistant";
	content: string;
	createdAt: string;
}

export type ChatMessage = Selectable<ChatMessageTable>;
export type NewChatMessage = Insertable<ChatMessageTable>;

export interface Database {
	chat: ChatTable;
	chatMessage: ChatMessageTable;
}
