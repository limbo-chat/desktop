import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import type * as limbo from "@limbo/api";
import { Button } from "../../../components/button";
import {
	EmptyState,
	EmptyStateActions,
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
import { useChatPanel } from "../hooks";
import { useChatPanelStore } from "../stores";

interface ErrorBoundaryFallbackProps extends FallbackProps {
	chatPanelId: string;
}

const ErrorBoundaryFallback = ({
	chatPanelId,
	error,
	resetErrorBoundary,
}: ErrorBoundaryFallbackProps) => {
	return (
		<ErrorState>
			<ErrorStateTitle>
				Failed to render <code>{chatPanelId}</code>
			</ErrorStateTitle>
			{error.message && <ErrorStateDescription>{error.message}</ErrorStateDescription>}
			<ErrorStateActions>
				<Button onClick={() => resetErrorBoundary()}>Try again</Button>
			</ErrorStateActions>
		</ErrorState>
	);
};

export interface ChatPanelRendererProps {
	chatPanelId: string;
	chatPanelData: limbo.JsonObject;
}

export const ChatPanelRenderer = ({ chatPanelId, chatPanelData }: ChatPanelRendererProps) => {
	const chatPanel = useChatPanel(chatPanelId);

	if (!chatPanel) {
		return (
			<EmptyState>
				<EmptyStateTitle>View not found</EmptyStateTitle>
				<EmptyStateDescription>{`"${chatPanelId}" was not found`}</EmptyStateDescription>
				<EmptyStateActions>
					<Button
						onClick={() => {
							const chatPanelStore = useChatPanelStore.getState();

							chatPanelStore.removeChatPanel(chatPanelId);
						}}
					>
						Close panel
					</Button>
				</EmptyStateActions>
			</EmptyState>
		);
	}

	const Component = chatPanel.component;

	return (
		<QueryErrorResetBoundary>
			{(queryBoundary) => (
				<ErrorBoundary
					onReset={queryBoundary.reset}
					fallbackRender={(fallbackProps) => (
						<ErrorBoundaryFallback chatPanelId={chatPanelId} {...fallbackProps} />
					)}
				>
					<Suspense fallback={<LoadingState />}>
						<Component data={chatPanelData} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};
