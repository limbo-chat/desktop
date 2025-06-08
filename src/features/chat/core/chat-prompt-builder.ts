import type * as limbo from "limbo";

export interface PromptBuilderOptions {
	systemPrompt?: string;
	userPrompt?: string;
}

export class ChatMessageBuilder implements limbo.ChatMessageBuilder {
	private role: limbo.ChatPromptMessageRole;
	private nodes: limbo.ChatMessageNode[];

	constructor(chatMessage: limbo.ChatPromptMessage) {
		this.role = chatMessage.role;
		this.nodes = chatMessage.content;
	}

	getRole() {
		return this.role;
	}

	setRole(role: limbo.ChatPromptMessageRole) {
		this.role = role;
	}

	getNode(index: number) {
		return this.nodes[index];
	}

	getNodes() {
		return [...this.nodes];
	}

	prependNode(node: limbo.ChatMessageNode) {
		this.nodes.unshift(node);
	}

	appendNode(node: limbo.ChatMessageNode) {
		console.log("Appending node to message:", node);

		this.nodes.push(node);
	}

	insertNode(index: number, newNodeOrNodes: limbo.ChatMessageNode | limbo.ChatMessageNode[]) {
		if (Array.isArray(newNodeOrNodes)) {
			this.nodes.splice(index, 0, ...newNodeOrNodes);
		} else {
			this.nodes.splice(index, 0, newNodeOrNodes);
		}
	}

	replaceNode(
		oldNode: limbo.ChatMessageNode,
		newNodeOrNodes: limbo.ChatMessageNode | limbo.ChatMessageNode[]
	) {
		const index = this.getNodeIndex(oldNode);

		this.replaceNodeAt(index, newNodeOrNodes);
	}

	replaceNodeAt(index: number, newNodeOrNodes: limbo.ChatMessageNode | limbo.ChatMessageNode[]) {
		if (index < 0 || index >= this.nodes.length) {
			return;
		}

		if (Array.isArray(newNodeOrNodes)) {
			this.nodes.splice(index, 1, ...newNodeOrNodes);
		} else {
			this.nodes[index] = newNodeOrNodes;
		}
	}

	removeNode(node: limbo.ChatMessageNode) {
		const index = this.getNodeIndex(node);

		if (index === -1) {
			return;
		}

		this.nodes.splice(index, 1);
	}

	removeNodeAt(index: number) {
		if (index < 0 || index >= this.nodes.length) {
			return;
		}

		this.nodes.splice(index, 1);
	}

	clearNodes() {
		this.nodes = [];
	}

	public toPromptMessage(): limbo.ChatPromptMessage {
		return {
			role: this.role,
			content: this.nodes,
		};
	}

	private getNodeIndex(node: limbo.ChatMessageNode) {
		return this.nodes.findIndex((n) => n === node);
	}
}

export class ChatPromptBuilder implements limbo.ChatPromptBuilder {
	private systemPrompt = "";
	private messages: ChatMessageBuilder[] = [];

	getSystemPrompt() {
		return this.systemPrompt;
	}

	setSystemPrompt(text: string) {
		this.systemPrompt = text;
	}

	prependToSystemPrompt(text: string) {
		this.systemPrompt = text + this.systemPrompt;
	}

	appendToSystemPrompt(text: string) {
		this.systemPrompt = this.systemPrompt + text;
	}

	getMessage(index: number) {
		return this.messages[index];
	}

	getMessages() {
		return [...this.messages];
	}

	appendMessage(message: ChatMessageBuilder) {
		this.messages.push(message);
	}

	prependMessage(message: ChatMessageBuilder) {
		this.messages.unshift(message);
	}

	insertMessage(index: number, newMessageOrMessages: ChatMessageBuilder | ChatMessageBuilder[]) {
		if (Array.isArray(newMessageOrMessages)) {
			this.messages.splice(index, 0, ...newMessageOrMessages);
		} else {
			this.messages.splice(index, 0, newMessageOrMessages);
		}
	}

	replaceMessage(
		oldMessage: ChatMessageBuilder,
		newMessageOrMessages: ChatMessageBuilder | ChatMessageBuilder[]
	) {
		const index = this.messages.indexOf(oldMessage);

		this.replaceMessageAt(index, newMessageOrMessages);
	}

	replaceMessageAt(index: number, messageOrMessages: ChatMessageBuilder | ChatMessageBuilder[]) {
		if (index < 0 || index >= this.messages.length) {
			return;
		}

		if (Array.isArray(messageOrMessages)) {
			this.messages.splice(index, 1, ...messageOrMessages);
		} else {
			this.messages[index] = messageOrMessages;
		}
	}

	removeMessage(message: ChatMessageBuilder) {
		const index = this.getMessageIndex(message);

		this.removeMessageAt(index);
	}

	removeMessageAt(index: number) {
		if (index < 0 || index >= this.messages.length) {
			return;
		}

		this.messages.splice(index, 1);
	}

	clearMessages() {
		this.messages = [];
	}

	createMessage(message: limbo.ChatPromptMessage) {
		return new ChatMessageBuilder(message);
	}

	public toPromptMessages(): limbo.ChatPromptMessage[] {
		const messages = this.getMessages().map((m) => m.toPromptMessage());

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
			...messages,
		];
	}

	private getMessageIndex(message: limbo.ChatMessageBuilder) {
		return this.messages.findIndex((m) => m === message);
	}
}
