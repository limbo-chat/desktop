import type * as limbo from "limbo";

export interface PromptBuilderOptions {
	systemPrompt?: string;
	userPrompt?: string;
}

export class PromptBuilder implements limbo.PromptBuilder {
	private systemPrompt: string;
	private userPrompt: string;
	private tools: limbo.Tool[] = [];

	constructor(opts?: PromptBuilderOptions) {
		this.systemPrompt = opts?.systemPrompt || "";
		this.userPrompt = opts?.userPrompt || "";
	}

	public getSystemPrompt() {
		return this.systemPrompt;
	}

	public getUserPrompt() {
		return this.userPrompt;
	}

	public prependToSystemPrompt(text: string) {
		this.systemPrompt = text + this.systemPrompt;
	}

	public appendToSystemPrompt(text: string) {
		this.systemPrompt = this.systemPrompt + text;
	}

	public getTools() {
		return this.tools;
	}

	public addTool(tool: limbo.Tool) {
		this.tools.push(tool);
	}
}
