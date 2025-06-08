import { useMemo } from "react";
import type * as limbo from "limbo";
import { useChatNodes } from "../../chat-nodes/hooks";
import { MarkdownNodeRenderer } from "./markdown";
import { TextNodeRenderer } from "./text";
import { ToolCallNodeRenderer } from "./tool-call";
import { UnknownNodeRenderer } from "./unknown";

export interface NodeRendererProps {
	node: limbo.ChatMessageNode;
}

const coreRenderers: Record<string, limbo.ui.ChatNodeComponent> = {
	text: TextNodeRenderer,
	markdown: MarkdownNodeRenderer,
	tool_call: ToolCallNodeRenderer,
} as const;

export const NodeRenderer = ({ node }: NodeRendererProps) => {
	const chatNodes = useChatNodes();

	const renderers = useMemo(() => {
		const allRenderers = { ...coreRenderers };

		for (const chatNode of chatNodes.values()) {
			allRenderers[chatNode.id] = chatNode.component;
		}

		return allRenderers;
	}, [chatNodes]);

	console.log(chatNodes);

	const Renderer = renderers[node.type];

	if (!Renderer) {
		return <UnknownNodeRenderer node={node} />;
	}

	return <Renderer node={node} />;
};
