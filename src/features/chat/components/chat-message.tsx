import clsx from "clsx";
import MarkdownToJsx from "markdown-to-jsx";
import { memo, type HTMLAttributes } from "react";
import { CodeBlock } from "../../markdown/components/code-block";
import { Markdown } from "../../markdown/components/markdown";
import { useRegisteredTool } from "../../plugins/hooks";
import type {
	AssistantChatMessage,
	ChatMessageType,
	TextNode,
	ToolCallNode,
	UserChatMessage,
} from "../types";
import { DefaultToolCallRenderer } from "./default-tool-call-renderer";
import { TextNodeContainer, ToolCallNodeContainer } from "./nodes";

interface ChatMessageContainerProps extends HTMLAttributes<HTMLDivElement> {
	message: ChatMessageType;
	className?: string;
}

const ChatMessageContainer = ({ message, className, ...props }: ChatMessageContainerProps) => {
	return (
		<div
			className={clsx("chat-message", className)}
			data-message-id={message.id}
			data-message-role={message.role}
			{...props}
		/>
	);
};

interface UserChatMessageProps {
	message: UserChatMessage;
}

const UserChatMessage = ({ message }: UserChatMessageProps) => {
	return (
		<ChatMessageContainer message={message} className="user-message">
			{message.content.map((content, idx) => {
				if (content.type !== "text") {
					return null;
				}

				return (
					<TextNodeContainer node={content} key={idx}>
						{content.text}
					</TextNodeContainer>
				);
			})}
		</ChatMessageContainer>
	);
};

interface AssistantChatMessageProps {
	message: AssistantChatMessage;
}

interface AssistantChatMessageTextContentRendererProps {
	node: TextNode;
}

const AssistantChatMessageMarkdownRenderer = ({
	node,
}: AssistantChatMessageTextContentRendererProps) => {
	return (
		<TextNodeContainer node={node}>
			<Markdown>
				<MarkdownToJsx
					options={{
						overrides: {
							a: {
								props: {
									target: "_blank",
								},
							},
							input: {
								props: {
									disabled: true,
								},
							},
							code: (props) => (
								<CodeBlock
									lang={
										props.className
											? props.className.split("lang-")[1]
											: undefined
									}
									content={props.children}
								/>
							),
						},
					}}
				>
					{node.text}
				</MarkdownToJsx>
			</Markdown>
		</TextNodeContainer>
	);
};

interface AssistantChatMessageToolCallRendererProps {
	node: ToolCallNode;
}

const AssistantChatMessageToolCallRenderer = ({
	node,
}: AssistantChatMessageToolCallRendererProps) => {
	const tool = useRegisteredTool(node.toolId);
	const Renderer = tool?.renderer ?? DefaultToolCallRenderer;

	return (
		<ToolCallNodeContainer node={node}>
			<Renderer toolCall={node} />
		</ToolCallNodeContainer>
	);
};

const assistantChatMessageContentRenderers = {
	text: AssistantChatMessageMarkdownRenderer,
	tool_call: AssistantChatMessageToolCallRenderer,
} as const;

const AssistantChatMessage = ({ message }: AssistantChatMessageProps) => {
	return (
		<ChatMessageContainer
			className="assistant-message"
			message={message}
			data-status={message.status}
		>
			{message.content.map((node, idx) => {
				const ContentRenderer = assistantChatMessageContentRenderers[node.type];

				if (!ContentRenderer) {
					return null;
				}

				/* @ts-expect-error still don't know how to get types working here lol */
				return <ContentRenderer node={node} key={idx} />;
			})}
		</ChatMessageContainer>
	);
};

const chatMessageRoleComponents = {
	user: UserChatMessage,
	assistant: AssistantChatMessage,
} as const;

export interface ChatMessageProps {
	message: ChatMessageType;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
	const Component = chatMessageRoleComponents[message.role];

	// @ts-ignore
	return <Component message={message} />;
});
