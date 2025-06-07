import type * as limbo from "limbo";
import { MarkdownNodeRenderer } from "./markdown";
import { TextNodeRenderer } from "./text";
import { ToolCallNodeRenderer } from "./tool-call";
import { UnknownNodeRenderer } from "./unknown";

export interface NodeRendererProps {
	node: limbo.ChatMessageNode;
}

// TODO, correct any value type
const coreRenderers: Record<string, any> = {
	text: TextNodeRenderer,
	markdown: MarkdownNodeRenderer,
	tool_call: ToolCallNodeRenderer,
} as const;

export const NodeRenderer = ({ node }: NodeRendererProps) => {
	const Renderer = coreRenderers[node.type];

	if (!Renderer) {
		return <UnknownNodeRenderer node={node} />;
	}

	return <Renderer node={node} />;
};
