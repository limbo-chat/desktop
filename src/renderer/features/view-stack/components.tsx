import { Suspense, type PropsWithChildren } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "../../components/button";
import {
	ErrorState,
	ErrorStateActions,
	ErrorStateDescription,
	ErrorStateTitle,
} from "../../components/error-state";
import { LoadingState } from "../../components/loading-state";
import { viewStackContext } from "./contexts";
import { useViewStackState } from "./hooks";
import type { View, ViewComponentProps } from "./types";

const ViewErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<ErrorState>
			<ErrorStateTitle>Something went wrong</ErrorStateTitle>
			<ErrorStateDescription>
				{error.message ?? "An unknown error occurred"}
			</ErrorStateDescription>
			<ErrorStateActions>
				<Button onClick={() => resetErrorBoundary()}>Try again</Button>
			</ErrorStateActions>
		</ErrorState>
	);
};

const ViewContainer = ({ children }: PropsWithChildren) => {
	return (
		<QueryErrorResetBoundary>
			{(queryBoundary) => (
				<ErrorBoundary FallbackComponent={ViewErrorFallback} onReset={queryBoundary.reset}>
					<Suspense fallback={<LoadingState />}>{children}</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};

export interface ViewStackProps {
	views: Record<string, React.FunctionComponent<ViewComponentProps<any>>>;
	defaultView: View;
}

export const ViewStack = ({ views, defaultView }: ViewStackProps) => {
	const viewStack = useViewStackState();
	const activeView = viewStack.top ?? defaultView;
	const ViewComponent = views[activeView.id];

	return (
		<viewStackContext.Provider value={viewStack}>
			<div className="view-stack" data-view={activeView.id}>
				{ViewComponent && (
					<ViewContainer>
						<ViewComponent view={activeView} />
					</ViewContainer>
				)}
			</div>
		</viewStackContext.Provider>
	);
};
