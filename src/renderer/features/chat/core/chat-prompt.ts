import type * as limbo from "@limbo-chat/api";

export class ChatMessage implements limbo.ChatMessage {
	private role: limbo.ChatMessageRole;
	private nodes: limbo.ChatMessageNode[] = [];

	constructor(role: limbo.ChatMessageRole) {
		this.role = role;
	}

	getRole() {
		return this.role;
	}

	setRole(role: limbo.ChatMessageRole) {
		this.role = role;
	}

	getNode(index: number) {
		return this.nodes[index];
	}

	getNodes() {
		return [...this.nodes];
	}

	setNodes(nodes: limbo.ChatMessageNode[]): void {
		this.nodes = [...nodes];
	}

	prependNode(node: limbo.ChatMessageNode) {
		this.nodes.unshift(node);
	}

	appendNode(node: limbo.ChatMessageNode) {
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

	clone() {
		const newMessage = new ChatMessage(this.role);

		for (const node of this.nodes) {
			newMessage.appendNode(structuredClone(node));
		}

		return newMessage;
	}

	private getNodeIndex(node: limbo.ChatMessageNode) {
		return this.nodes.findIndex((n) => n === node);
	}
}

export class ChatPrompt implements limbo.ChatPrompt {
	private messages: limbo.ChatMessage[] = [];

	getMessage(index: number) {
		return this.messages[index];
	}

	getMessages() {
		return [...this.messages];
	}

	setMessages(messages: limbo.ChatMessage[]) {
		this.messages = [...messages];
	}

	appendMessage(message: limbo.ChatMessage) {
		this.messages.push(message);
	}

	prependMessage(message: limbo.ChatMessage) {
		this.messages.unshift(message);
	}

	insertMessage(index: number, newMessageOrMessages: limbo.ChatMessage | limbo.ChatMessage[]) {
		if (Array.isArray(newMessageOrMessages)) {
			this.messages.splice(index, 0, ...newMessageOrMessages);
		} else {
			this.messages.splice(index, 0, newMessageOrMessages);
		}
	}

	replaceMessage(oldMessage: ChatMessage, newMessageOrMessages: ChatMessage | ChatMessage[]) {
		const index = this.messages.indexOf(oldMessage);

		this.replaceMessageAt(index, newMessageOrMessages);
	}

	replaceMessageAt(index: number, messageOrMessages: limbo.ChatMessage | limbo.ChatMessage[]) {
		if (index < 0 || index >= this.messages.length) {
			return;
		}

		if (Array.isArray(messageOrMessages)) {
			this.messages.splice(index, 1, ...messageOrMessages);
		} else {
			this.messages[index] = messageOrMessages;
		}
	}

	removeMessage(message: limbo.ChatMessage) {
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

	createMessage(role: limbo.ChatMessageRole = "assistant") {
		return new ChatMessage(role);
	}

	clone() {
		const newPrompt = new ChatPrompt();

		for (const message of this.messages) {
			newPrompt.appendMessage(message.clone());
		}

		return newPrompt;
	}

	private getMessageIndex(message: limbo.ChatMessage) {
		return this.messages.findIndex((m) => m === message);
	}
}
