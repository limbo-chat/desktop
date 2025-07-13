import { memo, type HTMLAttributes } from "react";
import { AppIcon } from "../../../components/app-icon";
import { IconButton } from "../../../components/icon-button";
import { Tooltip } from "../../../components/tooltip";
import { ChatNodeRenderer } from "../../chat-nodes/components/chat-node-renderer";
import type {
	AssistantChatMessage as AssistantChatMessageRenderer,
	ChatMessageType,
	UserChatMessage as UserChatMessageRenderer,
} from "../types";

interface ChatMessageContainerProps extends HTMLAttributes<HTMLDivElement> {
	message: ChatMessageType;
}

const ChatMessageContainer = ({ message, ...props }: ChatMessageContainerProps) => {
	return <div className="chat-message" data-role={message.role} {...props} />;
};

const ChatMessageContent = (props: HTMLAttributes<HTMLDivElement>) => {
	return <div className="chat-message-content" {...props} />;
};

const ChatMessageFooter = (props: HTMLAttributes<HTMLDivElement>) => {
	return <div className="chat-message-footer" {...props} />;
};

const ChatMessageActions = (props: HTMLAttributes<HTMLDivElement>) => {
	return <div className="chat-message-actions" {...props} />;
};

interface UserChatMessageRendererProps {
	message: UserChatMessageRenderer;
}

const UserChatMessageRenderer = ({ message }: UserChatMessageRendererProps) => {
	return (
		<ChatMessageContainer message={message}>
			<ChatMessageContent>
				{message.content.map((node, idx) => (
					<ChatNodeRenderer node={node} key={idx} />
				))}
			</ChatMessageContent>
			<ChatMessageFooter>
				<ChatMessageActions>
					<Tooltip label="Copy message">
						<IconButton action="copy-message">
							<AppIcon icon="copy" />
						</IconButton>
					</Tooltip>
				</ChatMessageActions>
			</ChatMessageFooter>
		</ChatMessageContainer>
	);
};

interface AssistantChatMessageRendererProps {
	message: AssistantChatMessageRenderer;
}

const AssistantChatMessageRenderer = ({ message }: AssistantChatMessageRendererProps) => {
	return (
		<ChatMessageContainer message={message} data-status={message.status}>
			<ChatMessageContent>
				{message.content.map((node, idx) => (
					<ChatNodeRenderer node={node} key={idx} />
				))}
			</ChatMessageContent>
			<ChatMessageFooter>
				<ChatMessageActions>
					<Tooltip label="Copy message">
						<IconButton action="copy-message">
							<AppIcon icon="copy" />
						</IconButton>
					</Tooltip>
				</ChatMessageActions>
			</ChatMessageFooter>
		</ChatMessageContainer>
	);
};

const chatMessageRenderers = {
	user: UserChatMessageRenderer,
	assistant: AssistantChatMessageRenderer,
} as const;

export interface ChatMessageProps {
	message: ChatMessageType;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
	const Component = chatMessageRenderers[message.role];

	// @ts-ignore
	return <Component message={message} />;
});
