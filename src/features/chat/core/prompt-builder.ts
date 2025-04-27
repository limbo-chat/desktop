import type * as limbo from "limbo";

export interface PromptBuilderOptions {
	systemPrompt?: string;
	userPrompt?: string;
}

export class PromptBuilder implements limbo.PromptBuilder {
	private messages: limbo.PromptMessage[] = [];
	private tools: limbo.Tool[] = [];

	public getMessages() {
		return this.messages;
	}

	public appendMessage(message: limbo.PromptMessage) {
		this.messages.push(message);
	}

	public prependMessage(message: limbo.PromptMessage): void {
		this.messages.unshift(message);
	}

	public getTools() {
		return this.tools;
	}

	public addTool(tool: limbo.Tool) {
		this.tools.push(tool);
	}
}
