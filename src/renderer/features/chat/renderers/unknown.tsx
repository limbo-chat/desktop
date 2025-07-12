import type * as limbo from "@limbo/api";
import {
	EmptyState,
	EmptyStateDescription,
	EmptyStateTitle,
} from "../../../components/empty-state";

export interface UnknownNodeRendererProps {
	node: limbo.ChatMessageNode;
}

export const UnknownNodeRenderer = ({ node }: UnknownNodeRendererProps) => {
	return (
		<EmptyState>
			<EmptyStateTitle>Unknown node</EmptyStateTitle>
			<EmptyStateDescription>
				The node type "{node.type}" is not recognized.
			</EmptyStateDescription>
		</EmptyState>
	);
};
