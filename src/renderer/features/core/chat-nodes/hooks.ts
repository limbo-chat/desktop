import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { addChatNode, removeChatNode } from "../../chat-nodes/utils";
import { markdownNode } from "./markdown";
import { textNode } from "./text";
import { toolCallNode } from "./tool-call";

export const useRegisterCoreChatNodes = () => {
	useEffect(() => {
		const textNodeId = buildNamespacedResourceId("core", textNode.id);
		const markdownNodeId = buildNamespacedResourceId("core", markdownNode.id);
		const toolCallNodeId = buildNamespacedResourceId("core", toolCallNode.id);

		addChatNode(textNodeId, textNode);
		addChatNode(markdownNodeId, markdownNode);
		addChatNode(toolCallNodeId, toolCallNode);

		return () => {
			removeChatNode(textNodeId);
			removeChatNode(markdownNodeId);
			removeChatNode(toolCallNodeId);
		};
	}, []);
};
