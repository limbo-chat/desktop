import type * as limbo from "@limbo/api";
import { MarkdownContainer } from "../../markdown/components/markdown-container";
import { MarkdownRenderer } from "../../markdown/components/markdown-renderer";

export interface MarkdownNodeRendererProps {
	node: limbo.ChatMessageNode;
}

export const MarkdownNodeRenderer = ({ node }: MarkdownNodeRendererProps) => {
	return (
		<MarkdownContainer>
			<MarkdownRenderer content={node.data.content as string} />
		</MarkdownContainer>
	);
};
