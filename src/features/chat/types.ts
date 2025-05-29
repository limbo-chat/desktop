import type { ChatNode } from "../../../electron/chats/types";

export interface BaseChatMessage {
	id: string;
	createdAt: string;
	content: ChatNode[];
}

export interface UserChatMessage extends BaseChatMessage {
	role: "user";
}

export interface AssistantChatMessage extends BaseChatMessage {
	role: "assistant";
	status: "complete" | "pending";
}

export type ChatMessageType = UserChatMessage | AssistantChatMessage;
