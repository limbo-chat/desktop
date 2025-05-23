import { Collapsible as ArkCollapsible } from "@ark-ui/react";
import { ChevronDown, ClipboardIcon } from "lucide-react";
import { useMemo } from "react";
import type * as limbo from "limbo";
import { IconButton } from "../../../components/icon-button";
import { parseNamespacedResourceId } from "../../../lib/utils";

interface ToolCallDataContainerProps {
	title: string;
	content: string;
}

const ToolCallDataContainer = ({ title, content }: ToolCallDataContainerProps) => {
	return (
		<div className="tool-call-data">
			<div className="tool-call-data-header">
				<span className="tool-call-data-title">{title}</span>
				<IconButton color="secondary" variant="ghost">
					<ClipboardIcon />
				</IconButton>
			</div>
			<div className="tool-call-data-content">{content}</div>
		</div>
	);
};

export const DefaultToolCallRenderer = ({ toolCall }: limbo.ToolRendererProps) => {
	const icon = useMemo(() => {
		const toolName = parseNamespacedResourceId(toolCall.toolId)?.resource ?? toolCall.toolId;

		return toolName.charAt(0).toUpperCase();
	}, [toolCall.toolId]);

	return (
		<ArkCollapsible.Root className="tool-call">
			<ArkCollapsible.Trigger asChild>
				<button className="tool-call-header">
					<div className="tool-call-info">
						<div className="tool-call-icon-container">{icon}</div>
						<span className="tool-call-id">{toolCall.toolId}</span>
					</div>
					<ChevronDown className="tool-call-collapse-icon" />
				</button>
			</ArkCollapsible.Trigger>
			<ArkCollapsible.Content className="tool-call-body">
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
			</ArkCollapsible.Content>
		</ArkCollapsible.Root>
	);
};
