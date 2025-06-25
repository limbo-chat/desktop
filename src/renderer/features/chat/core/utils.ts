import Ajv from "ajv";
import type * as limbo from "@limbo/api";
import { useChatStore } from "../stores";
import type { ChatMessageBuilder } from "./chat-prompt-builder";

const ajv = new Ajv();

export function convertMarkdownNodesToTextInMessage(message: limbo.ChatMessageBuilder) {
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

export function convertMarkdownNodesToTextInChatPrompt(chatPrompt: limbo.ChatPromptBuilder) {
	for (const message of chatPrompt.getMessages()) {
		convertMarkdownNodesToTextInMessage(message);
	}
}

export function serializeToolCallNodesInMessage(message: limbo.ChatMessageBuilder) {
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

export function serializeToolCallNodesInChatPrompt(chatPrompt: limbo.ChatPromptBuilder) {
	for (const message of chatPrompt.getMessages()) {
		serializeToolCallNodesInMessage(message);
	}
}

export function transformBuiltInNodesInChatPrompt(chatPrompt: limbo.ChatPromptBuilder) {
	convertMarkdownNodesToTextInChatPrompt(chatPrompt);
}

export interface AdaptPromptForCapabilitiesOptions {
	capabilities: limbo.LLM.Capability[];
	chatPromptBuilder: limbo.ChatPromptBuilder;
}

export function adaptChatPromptForCapabilities({
	capabilities,
	chatPromptBuilder,
}: AdaptPromptForCapabilitiesOptions) {
	if (!capabilities.includes("tool_calling")) {
		serializeToolCallNodesInChatPrompt(chatPromptBuilder);
	}
}

export interface CreateStoreConnectedMessageHandleOptions {
	chatId: string;
	messageId: string;
	messageBuilder: ChatMessageBuilder;
}

export function createStoreConnectedMessageHandle({
	chatId,
	messageId,
	messageBuilder,
}: CreateStoreConnectedMessageHandleOptions): limbo.MessageHandle {
	const syncToStore = () => {
		const chatStore = useChatStore.getState();

		chatStore.setMessageNodes(chatId, messageId, messageBuilder.getNodes());
	};

	return {
		getNode: (index) => {
			return messageBuilder.getNode(index);
		},
		getNodes: () => {
			return messageBuilder.getNodes();
		},
		prependNode: (node) => {
			messageBuilder.prependNode(node);

			syncToStore();
		},
		appendNode: (node) => {
			messageBuilder.appendNode(node);

			syncToStore();
		},
		removeNode: (node) => {
			messageBuilder.removeNode(node);

			syncToStore();
		},
		removeNodeAt: (index) => {
			messageBuilder.removeNodeAt(index);

			syncToStore();
		},
		replaceNode: (index, node) => {
			messageBuilder.replaceNode(index, node);

			syncToStore();
		},
		replaceNodeAt(index, newNodeOrNodes) {
			messageBuilder.replaceNodeAt(index, newNodeOrNodes);

			syncToStore();
		},
	};
}
