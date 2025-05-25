import type * as limbo from "limbo";

export interface PromptBuilderOptions {
	systemPrompt?: string;
	userPrompt?: string;
}

export class ChatPromptBuilder implements limbo.ChatPromptBuilder {
	private systemPrompt = "";
	private messages: limbo.PromptMessage[] = [];

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

	public appendMessage(message: limbo.PromptMessage) {
		this.messages.push(message);
	}

	public toPromptMessages(): limbo.PromptMessage[] {
		return [
			{
				role: "system",
				content: this.systemPrompt,
			},
			...this.messages,
		];
	}
}
