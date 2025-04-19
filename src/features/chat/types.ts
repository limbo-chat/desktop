export interface BaseChatMessage {
	id: string;
	content: string;
	createdAt: string;
}

export interface UserChatMessage extends BaseChatMessage {
	role: "user";
}

export interface AssistantChatMessage extends BaseChatMessage {
	role: "assistant";
	status: "complete" | "pending";
}

export type ChatMessageType = UserChatMessage | AssistantChatMessage;
