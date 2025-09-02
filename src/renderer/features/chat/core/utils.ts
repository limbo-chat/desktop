import type * as limbo from "@limbo-chat/api";
import { useChatStore } from "../stores";

export function convertMarkdownNodesToTextInPrompt(prompt: limbo.ChatPrompt) {
	for (const message of prompt.getMessages()) {
		for (const node of message.getNodes()) {
			if (node.type === "markdown") {
				message.replaceNode(node, {
					type: "text",
					data: {
						content: node.data.content,
					},
				});
			}
		}
	}
}

export function polyfillToolCallingInPrompt(prompt: limbo.ChatPrompt) {
	const messages = prompt.getMessages();

	for (const message of messages) {
		for (const node of message.getNodes()) {
			if (node.type === "tool_call") {
				const toolCallData = node.data;

				let resultText = "";

				if (toolCallData.status === "success") {
					resultText = `Result: ${toolCallData.result}`;
				} else if (toolCallData.status === "error") {
					resultText = `Error: ${toolCallData.error ?? "Unknown error"}`;
				}

				message.replaceNode(node, {
					type: "text",
					data: {
						content: `Tool call: ${toolCallData.id}\nArguments: ${JSON.stringify(toolCallData.arguments)}\n${resultText}`,
					},
				});
			}
		}
	}
}

export function transformBuiltInNodesInPrompt(prompt: limbo.ChatPrompt) {
	convertMarkdownNodesToTextInPrompt(prompt);
}

export function polyfillPromptForLLM(llm: limbo.LLM, prompt: limbo.ChatPrompt) {
	if (!llm.capabilities.includes("tool_calling")) {
		polyfillToolCallingInPrompt(prompt);
	}
}

export interface CreateStoreConnectedMessageHandleOptions {
	chatId: string;
	messageId: string;
	message: limbo.ChatMessage;
}

export function createStoreConnectedMessage({
	chatId,
	messageId,
	message,
}: CreateStoreConnectedMessageHandleOptions): limbo.ChatMessage {
	const syncToStore = () => {
		const chatStore = useChatStore.getState();

		chatStore.setMessageNodes(chatId, messageId, message.getNodes());
	};

	return {
		getRole: () => {
			return message.getRole();
		},
		setRole: () => {
			// noop
		},
		getNode: (index) => {
			return message.getNode(index);
		},
		getNodes: () => {
			return message.getNodes();
		},
		setNodes: (nodes) => {
			message.setNodes(nodes);

			syncToStore();
		},
		appendNode: (node) => {
			message.appendNode(node);

			syncToStore();
		},
		prependNode: (node) => {
			message.prependNode(node);

			syncToStore();
		},
		removeNode: (node) => {
			message.removeNode(node);

			syncToStore();
		},
		removeNodeAt: (index) => {
			message.removeNodeAt(index);

			syncToStore();
		},
		insertNode: (index, newNodeOrNodes) => {
			message.insertNode(index, newNodeOrNodes);

			syncToStore();
		},
		replaceNode: (index, node) => {
			message.replaceNode(index, node);

			syncToStore();
		},
		replaceNodeAt(index, newNodeOrNodes) {
			message.replaceNodeAt(index, newNodeOrNodes);

			syncToStore();
		},
		clearNodes: () => {
			message.clearNodes();

			syncToStore();
		},
		clone: () => {
			return message.clone();
		},
	};
}
