import type * as limbo from "limbo";

export interface TextNodeRendererProps {
	node: limbo.TextChatMessageNode;
}

export const TextNodeRenderer = ({ node }: TextNodeRendererProps) => {
	return (
		<div className="node" data-type={node.type}>
			{node.data.content}
		</div>
	);
};
