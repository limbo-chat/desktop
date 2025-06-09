import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ClipboardIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import type * as limbo from "limbo";
import { IconButton } from "../../../components/icon-button";
import { useMainRouter } from "../../../lib/trpc";
import { parseNamespacedResourceId } from "../../../lib/utils";
import { useTool, useToolCall } from "../../tools/hooks";
import { useToolCallStore } from "../../tools/stores";

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
		// TODO handle tool icons
		const toolName = parseNamespacedResourceId(toolCall.toolId)?.resource ?? toolCall.toolId;

		return toolName.charAt(0).toUpperCase();
	}, [tool, toolCall.toolId]);

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

interface ToolCallRendererProps {
	toolCall: limbo.ToolCall;
}

const ToolCallRenderer = ({ toolCall }: ToolCallRendererProps) => {
	const tool = useTool(toolCall.toolId);
	const Renderer = tool?.renderer ?? DefaultToolCallRenderer;

	return <Renderer toolCall={toolCall} />;
};

export const ToolCallNodeRenderer = ({ node }: limbo.ui.ChatNodeComponentProps) => {
	const toolCallId = node.data.tool_call_id as string;

	const mainRouter = useMainRouter();
	const toolCallState = useToolCall(toolCallId);

	const getToolCallQuery = useQuery(
		mainRouter.toolCalls.get.queryOptions(
			{
				id: toolCallId,
			},
			{
				// if the tool call is not loaded, we fetch it
				enabled: toolCallState === undefined,
			}
		)
	);

	useEffect(() => {
		if (!getToolCallQuery.data) {
			return;
		}

		const toolCallStore = useToolCallStore.getState();

		// @ts-ignore TEMP IGNORE
		toolCallStore.addToolCall(getToolCallQuery.data);
	}, [getToolCallQuery.data]);

	if (!toolCallState) {
		if (getToolCallQuery.isError) {
			return (
				<div className="node" data-type={node.type} data-status="error">
					Failed to load tool call: {toolCallId}
				</div>
			);
		}

		return (
			<div className="node" data-type={node.type} data-status="loading">
				Loading tool call: {toolCallId}
			</div>
		);
	}

	return (
		<div
			className="node"
			data-type={node.type}
			data-tool-id={toolCallState.toolId}
			data-status={toolCallState.status}
		>
			<ToolCallRenderer toolCall={toolCallState} />
		</div>
	);
};
