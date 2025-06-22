import type * as limbo from "@limbo/api";

export const TextNodeRenderer = ({ node }: limbo.ui.ChatNodeComponentProps) => {
	return (
		<div className="node" data-type={node.type}>
			{node.data.content as string}
		</div>
	);
};
