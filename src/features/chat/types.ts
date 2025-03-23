export interface ChatMessageType {
	id: number;
	role: "user" | "assistant";
	content: string;
}
