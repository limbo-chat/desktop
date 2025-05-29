import type { Insertable, Selectable } from "kysely";

export interface ChatTable {
	id: string;
	name: string;
	createdAt: string;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;

export interface ChatMessageTable {
	id: string;
	chatId: string;
	role: "user" | "assistant";
	// cant store JSON in sqlite directly, so we store it as a string
	content: string;
	createdAt: string;
}

export type ChatMessage = Selectable<ChatMessageTable>;
export type NewChatMessage = Insertable<ChatMessageTable>;

export interface ToolCallTable {
	id: string;
	toolId: string;
	status: "success" | "error";
	arguments: string;
	result: string | null;
	error: string | null;
}

export interface Database {
	chat: ChatTable;
	chatMessage: ChatMessageTable;
	toolCall: ToolCallTable;
}
