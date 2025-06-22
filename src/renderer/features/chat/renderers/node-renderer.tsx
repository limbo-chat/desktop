import { useMemo } from "react";
import type * as limbo from "@limbo/api";
import { useCollatedChatNodeComponents } from "../../chat-nodes/hooks";
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
	const collatedChatNodeComponents = useCollatedChatNodeComponents();

	const renderers = useMemo(() => {
		return {
			...coreRenderers,
			...Object.fromEntries(collatedChatNodeComponents),
		};
	}, [collatedChatNodeComponents]);

	const Renderer = renderers[node.type];

	if (!Renderer) {
		return <UnknownNodeRenderer node={node} />;
	}

	return <Renderer node={node} />;
};
