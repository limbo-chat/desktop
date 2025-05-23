import type { PropsWithChildren } from "react";
import type { TextNode, ToolCallNode } from "../types";

export interface TextNodeContainerProps {
	node: TextNode;
}

export const TextNodeContainer = ({
	node,
	children,
}: PropsWithChildren<TextNodeContainerProps>) => {
	return (
		<div className="text-node" data-node-type={node.type}>
			{children}
		</div>
	);
};

export interface ToolCallContainerProps {
	node: ToolCallNode;
}

export const ToolCallNodeContainer = ({
	node,
	children,
}: PropsWithChildren<ToolCallContainerProps>) => {
	return (
		<div
			className="tool-call-node"
			data-node-type={node.type}
			data-tool-id={node.toolId}
			data-tool-call-id={node.callId}
			data-status={node.status}
		>
			{children}
		</div>
	);
};
