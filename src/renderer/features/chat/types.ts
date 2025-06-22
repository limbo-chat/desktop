import type * as limbo from "@limbo/api";

export interface BaseChatMessage {
	id: string;
	createdAt: string;
	content: limbo.ChatMessageNode[];
}

export interface UserChatMessage extends BaseChatMessage {
	role: "user";
}

export interface AssistantChatMessage extends BaseChatMessage {
	role: "assistant";
	status: "complete" | "pending";
}

export type ChatMessageType = UserChatMessage | AssistantChatMessage;
