export interface TextChatNode {
	type: "text";
	text: string;
}

interface BaseToolCallChatNode {
	type: "tool_call";
	toolId: string;
	callId: string;
	arguments: Record<string, unknown>;
}

export interface SuccessToolCallChatNode extends BaseToolCallChatNode {
	status: "success";
	result: string;
}

export interface ErrorToolCallChatNode extends BaseToolCallChatNode {
	status: "error";
	error: string | null;
}

export type ToolCallChatNode = SuccessToolCallChatNode | ErrorToolCallChatNode;

export type ChatNode = TextChatNode | ToolCallChatNode;
