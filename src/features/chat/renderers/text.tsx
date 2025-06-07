import type * as limbo from "limbo";

export interface TextNodeRendererProps {
	node: limbo.ChatMessageNode;
}

export const TextNodeRenderer = ({ node }: TextNodeRendererProps) => {
	return (
		<div className="node" data-type={node.type}>
			{node.data.content as string}
		</div>
	);
};
