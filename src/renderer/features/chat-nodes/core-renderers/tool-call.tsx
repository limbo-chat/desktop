import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ChevronDown, ClipboardIcon } from "lucide-react";
import { Suspense, useMemo } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import type * as limbo from "@limbo/api";
import { ImageLikeRenderer } from "../../../components/app-icon";
import { Button } from "../../../components/button";
import {
	ErrorState,
	ErrorStateActions,
	ErrorStateDescription,
	ErrorStateTitle,
} from "../../../components/error-state";
import { IconButton } from "../../../components/icon-button";
import { LoadingState } from "../../../components/loading-state";
import { parseNamespacedResourceId } from "../../../lib/utils";
import { useTool } from "../../tools/hooks";

interface ToolCallDataContainerProps {
	title: string;
	content: string;
}

const ToolCallDataContainer = ({ title, content }: ToolCallDataContainerProps) => {
	return (
		<div className="tool-call-data">
			<div className="tool-call-data-header">
				<span className="tool-call-data-title">{title}</span>
				<IconButton>
					<ClipboardIcon />
				</IconButton>
			</div>
			<div className="tool-call-data-content">{content}</div>
		</div>
	);
};

export const DefaultToolCallRenderer = ({ toolCall }: limbo.ToolRendererProps) => {
	const tool = useTool(toolCall.toolId);

	const icon = useMemo(() => {
		if (!tool) {
			return;
		}

		if (tool.icon) {
			const imageLike = typeof tool.icon === "function" ? tool.icon({ toolCall }) : tool.icon;

			return <ImageLikeRenderer imageLike={imageLike} />;
		}

		const toolName = parseNamespacedResourceId(toolCall.toolId)?.resource ?? toolCall.toolId;

		return toolName.charAt(0).toUpperCase();
	}, [tool, toolCall]);

	return (
		<RadixCollapsible.Root className="tool-call">
			<RadixCollapsible.Trigger asChild>
				<button className="tool-call-header">
					<div className="tool-call-info">
						<div className="tool-call-icon-container">{icon}</div>
						<span className="tool-call-id">{toolCall.toolId}</span>
					</div>
					<ChevronDown className="tool-call-collapse-icon" />
				</button>
			</RadixCollapsible.Trigger>
			<RadixCollapsible.Content className="tool-call-body">
				<ToolCallDataContainer
					title="Arguments"
					content={JSON.stringify(toolCall.arguments)}
				/>
				{toolCall.status === "success" && (
					<ToolCallDataContainer title="Result" content={toolCall.result} />
				)}
				{toolCall.status === "error" && (
					<ToolCallDataContainer
						title="Error"
						content={toolCall.error ?? "An unknown error occurred"}
					/>
				)}
			</RadixCollapsible.Content>
		</RadixCollapsible.Root>
	);
};

interface ToolCallRendererErrorFallbackProps extends FallbackProps {
	toolCall: limbo.ToolCall;
}

const ToolCallRendererErrorFallback = ({
	toolCall,
	error,
	resetErrorBoundary,
}: ToolCallRendererErrorFallbackProps) => {
	return (
		<ErrorState>
			<ErrorStateTitle>
				Failed to render tool call <code>{toolCall.id}</code>
			</ErrorStateTitle>
			{error.message && <ErrorStateDescription>{error.message}</ErrorStateDescription>}
			<ErrorStateActions>
				<Button onClick={() => resetErrorBoundary()}>Try again</Button>
			</ErrorStateActions>
		</ErrorState>
	);
};

interface ToolCallRendererProps {
	toolCall: limbo.ToolCall;
}

const ToolCallRenderer = ({ toolCall }: ToolCallRendererProps) => {
	const tool = useTool(toolCall.toolId);
	const Renderer = tool?.renderer ?? DefaultToolCallRenderer;

	return (
		<QueryErrorResetBoundary>
			{(queryBoundary) => (
				<ErrorBoundary
					onReset={queryBoundary.reset}
					fallbackRender={(fallbackProps) => (
						<ToolCallRendererErrorFallback {...fallbackProps} toolCall={toolCall} />
					)}
				>
					<Suspense fallback={<LoadingState />}>
						<Renderer toolCall={toolCall} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};

export const ToolCallNodeRenderer = ({ node }: limbo.ui.ChatNodeComponentProps) => {
	const toolCall = node.data as any as limbo.ToolCall;

	return (
		<div className="tool-call-wrapper" data-tool-id={toolCall.id} data-status={toolCall.status}>
			<ToolCallRenderer toolCall={toolCall} />
		</div>
	);
};
