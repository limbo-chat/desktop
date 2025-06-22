import Ajv from "ajv";
import type * as limbo from "@limbo/api";

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

export interface ExecuteToolCallOptions {
	tool: limbo.Tool;
	args: any;
	messageHandle: limbo.MessageHandle;
	abortSignal: AbortSignal;
}

export type ExecuteToolCallResult =
	| { status: "success"; result: string }
	| { status: "error"; error: string | null };

export async function executeToolCall({
	tool,
	args,
	messageHandle,
	abortSignal,
}: ExecuteToolCallOptions): Promise<ExecuteToolCallResult> {
	const validateArguments = ajv.compile(tool.schema);
	const areArgumentsValid = validateArguments(args);

	if (!areArgumentsValid) {
		return {
			status: "error",
			error: "Invalid arguments",
		};
	}

	try {
		const result = await tool.execute({
			args,
			message: messageHandle,
			abortSignal,
		});

		return {
			status: "success",
			result,
		};
	} catch (error) {
		let errorMessage = null;

		if (error instanceof Error) {
			if (error.name === "AbortError") {
				errorMessage = "Aborted";
			} else {
				errorMessage = error.message;
			}
		}

		return {
			status: "error",
			error: errorMessage,
		};
	}
}
