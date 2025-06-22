import type * as limbo from "@limbo/api";

export interface UnknownNodeRendererProps {
	node: limbo.ChatMessageNode;
}

export const UnknownNodeRenderer = ({ node }: UnknownNodeRendererProps) => {
	return (
		<div className="node" data-type="unknown">
			<span>WARNING: UNKNOWN NODE FOUND "{node.type}"</span>
		</div>
	);
};
