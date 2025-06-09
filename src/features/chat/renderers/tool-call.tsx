import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ClipboardIcon } from "lucide-react";
import { useMemo } from "react";
import type * as limbo from "limbo";
import { IconButton } from "../../../components/icon-button";
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
	const toolCall = node.data as any as limbo.ToolCall;

	return (
		<div
			className="node"
			data-type={node.type}
			data-tool-id={toolCall.id}
			data-status={toolCall.status}
		>
			<ToolCallRenderer toolCall={toolCall} />
		</div>
	);
};
