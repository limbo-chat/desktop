import { Suspense, useMemo } from "react";
import type * as limbo from "@limbo/api";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "../../../components/button";
import {
	ErrorState,
	ErrorStateActions,
	ErrorStateDescription,
	ErrorStateTitle,
} from "../../../components/error-state";
import { LoadingState } from "../../../components/loading-state";
import { useCollatedChatNodeComponents } from "../../chat-nodes/hooks";
import { MarkdownNodeRenderer } from "../core-renderers/markdown";
import { TextNodeRenderer } from "../core-renderers/text";
import { ToolCallNodeRenderer } from "../core-renderers/tool-call";
import { UnknownNodeRenderer } from "../core-renderers/unknown";

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

const coreRenderers: Record<string, limbo.ui.ChatNodeComponent> = {
	text: TextNodeRenderer,
	markdown: MarkdownNodeRenderer,
	tool_call: ToolCallNodeRenderer,
} as const;

export interface ChatNodeRendererProps {
	node: limbo.ChatMessageNode;
}

export const ChatNodeRenderer = ({ node }: ChatNodeRendererProps) => {
	const collatedChatNodeComponents = useCollatedChatNodeComponents();

	const renderers = useMemo(() => {
		return {
			...coreRenderers,
			...Object.fromEntries(collatedChatNodeComponents),
		};
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
						<Suspense fallback={<LoadingState />}>
							{Renderer ? (
								<Renderer node={node} />
							) : (
								<UnknownNodeRenderer node={node} />
							)}
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
};
