import { Suspense, useMemo } from "react";
import type * as limbo from "@limbo/api";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "../../../components/button";
import {
	EmptyState,
	EmptyStateDescription,
	EmptyStateTitle,
} from "../../../components/empty-state";
import {
	ErrorState,
	ErrorStateActions,
	ErrorStateDescription,
	ErrorStateTitle,
} from "../../../components/error-state";
import { LoadingState } from "../../../components/loading-state";
import { useCollatedChatNodeComponents } from "../../chat-nodes/hooks";

interface UnknownNodeRendererProps {
	node: limbo.ChatMessageNode;
}

const UnknownNodeRenderer = ({ node }: UnknownNodeRendererProps) => {
	return (
		<EmptyState>
			<EmptyStateTitle>Unknown node</EmptyStateTitle>
			<EmptyStateDescription>
				The node type "{node.type}" is not recognized.
			</EmptyStateDescription>
		</EmptyState>
	);
};

interface ErrorBoundaryFallbackProps extends FallbackProps {
	node: limbo.ChatMessageNode;
}

const ErrorBoundaryFallback = ({ node, error, resetErrorBoundary }: ErrorBoundaryFallbackProps) => {
	return (
		<ErrorState>
			<ErrorStateTitle>
				Failed to render <code>{node.type}</code>
			</ErrorStateTitle>
			{error.message && <ErrorStateDescription>{error.message}</ErrorStateDescription>}
			<ErrorStateActions>
				<Button onClick={() => resetErrorBoundary()}>Try again</Button>
			</ErrorStateActions>
		</ErrorState>
	);
};

export interface ChatNodeRendererProps {
	node: limbo.ChatMessageNode;
}

export const ChatNodeRenderer = ({ node }: ChatNodeRendererProps) => {
	const collatedChatNodeComponents = useCollatedChatNodeComponents();

	const renderers = useMemo(() => {
		return Object.fromEntries(collatedChatNodeComponents);
	}, [collatedChatNodeComponents]);

	const Renderer = renderers[node.type];

	return (
		<div className="node" data-type={node.type}>
			<QueryErrorResetBoundary>
				{(queryBoundary) => (
					<ErrorBoundary
						onReset={queryBoundary.reset}
						fallbackRender={(fallbackProps) => (
							<ErrorBoundaryFallback node={node} {...fallbackProps} />
						)}
					>
						{Renderer ? (
							<Suspense fallback={<LoadingState />}>
								<Renderer node={node} />
							</Suspense>
						) : (
							<UnknownNodeRenderer node={node} />
						)}
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
};
