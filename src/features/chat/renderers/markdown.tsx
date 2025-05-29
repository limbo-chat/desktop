import type * as limbo from "limbo";
import { MarkdownContainer } from "../../markdown/components/markdown-container";
import { MarkdownRenderer } from "../../markdown/components/markdown-renderer";

export interface MarkdownNodeRendererProps {
	node: limbo.MarkdownChatMessageNode;
}

export const MarkdownNodeRenderer = ({ node }: MarkdownNodeRendererProps) => {
	return (
		<div className="node" data-type={node.type}>
			<MarkdownContainer>
				<MarkdownRenderer content={node.data.content} />
			</MarkdownContainer>
		</div>
	);
};
