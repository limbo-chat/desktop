import type * as limbo from "@limbo-chat/api";
import { MarkdownContainer } from "../../markdown/components/markdown-container";
import { MarkdownRenderer } from "../../markdown/components/markdown-renderer";

const MarkdownNodeRenderer = ({ node }: limbo.ui.ChatNodeComponentProps) => {
	return (
		<MarkdownContainer>
			<MarkdownRenderer content={node.data.content as string} />
		</MarkdownContainer>
	);
};

export const markdownNode: limbo.ui.ChatNode = {
	id: "markdown",
	component: MarkdownNodeRenderer,
};
