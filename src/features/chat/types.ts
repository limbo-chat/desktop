export interface TextNode {
	type: "text";
	text: string;
}

export interface BaseToolCallNode {
	type: "tool_call";
	toolId: string;
	callId: string;
	arguments: Record<string, any>;
}

export interface PendingToolCallNode extends BaseToolCallNode {
	status: "pending";
}

export interface SuccessToolCallNode extends BaseToolCallNode {
	status: "success";
	result: string;
}

export interface ErrorToolCallNode extends BaseToolCallNode {
	status: "error";
	error: string | null;
}

export type ToolCallNode = PendingToolCallNode | SuccessToolCallNode | ErrorToolCallNode;

export type ChatNode = TextNode | ToolCallNode;

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
