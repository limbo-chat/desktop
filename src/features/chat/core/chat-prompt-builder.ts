import type * as limbo from "limbo";

export interface PromptBuilderOptions {
	systemPrompt?: string;
	userPrompt?: string;
}

export class ChatPromptBuilder implements limbo.ChatPromptBuilder {
	private systemPrompt = "";
	private messages: limbo.ChatPromptMessage[] = [];

	public getSystemPrompt() {
		return this.systemPrompt;
	}

	public setSystemPrompt(text: string) {
		this.systemPrompt = text;
	}

	public prependToSystemPrompt(text: string) {
		this.systemPrompt = text + this.systemPrompt;
	}

	public appendToSystemPrompt(text: string) {
		this.systemPrompt = this.systemPrompt + text;
	}

	public getMessages() {
		return this.messages;
	}

	public appendMessage(message: limbo.ChatPromptMessage) {
		this.messages.push(message);
	}

	public replaceMessage(index: number, message: limbo.ChatPromptMessage) {
		if (index < 0 || index >= this.messages.length) {
			return;
		}

		this.messages[index] = message;
	}

	public deleteMessage(index: number) {
		if (index < 0 || index >= this.messages.length) {
			return;
		}

		this.messages.splice(index, 1);
	}

	public toPromptMessages(): limbo.ChatPromptMessage[] {
		return [
			{
				role: "system",
				content: [
					{
						type: "text",
						data: {
							content: this.getSystemPrompt(),
						},
					},
				],
			},
			...this.messages,
		];
	}
}
