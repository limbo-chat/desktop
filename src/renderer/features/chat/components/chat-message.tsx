import { memo, useMemo } from "react";
import { formatRelative } from "date-fns";
import { CopyIconButton } from "../../../components/copy-icon-button";
import { Tooltip } from "../../../components/tooltip";
import { ChatNodeRenderer } from "../../chat-nodes/components/chat-node-renderer";
import type {
	AssistantChatMessage as AssistantChatMessageRenderer,
	ChatMessageType,
	UserChatMessage as UserChatMessageRenderer,
} from "../types";

interface ChatMessageContainerProps extends React.ComponentProps<"div"> {
	message: ChatMessageType;
}

const ChatMessageContainer = ({ message, ...props }: ChatMessageContainerProps) => {
	return <div className="chat-message" data-role={message.role} {...props} />;
};

const ChatMessageContent = (props: React.ComponentProps<"div">) => {
	return <div className="chat-message-content" {...props} />;
};

const ChatMessageFooter = (props: React.ComponentProps<"div">) => {
	return <div className="chat-message-footer" {...props} />;
};

const ChatMessageActions = (props: React.ComponentProps<"div">) => {
	return <div className="chat-message-actions" {...props} />;
};

const ChatMessageInfo = (props: React.ComponentProps<"div">) => {
	return <div className="chat-message-info" {...props} />;
};

interface ChatMessageDateProps extends React.ComponentProps<"div"> {
	date: Date;
}

const ChatMessageDate = ({ date, ...props }: ChatMessageDateProps) => {
	const relativeText = useMemo(() => formatRelative(date, new Date()), [date]);

	return (
		<div className="chat-message-date" {...props}>
			{relativeText}
		</div>
	);
};

interface UserChatMessageRendererProps {
	message: UserChatMessageRenderer;
}

const UserChatMessageRenderer = ({ message }: UserChatMessageRendererProps) => {
	const createdAt = useMemo(() => new Date(message.createdAt), [message.createdAt]);

	const gatheredText = useMemo(() => {
		let text = "";

		for (const node of message.content) {
			if (node.type === "text") {
				text += node.data.content;
			}
		}

		return text;
	}, [message.content]);

	return (
		<ChatMessageContainer message={message}>
			<ChatMessageContent>
				{message.content.map((node, idx) => (
					<ChatNodeRenderer node={node} key={idx} />
				))}
			</ChatMessageContent>
			<ChatMessageFooter>
				<ChatMessageInfo>
					<ChatMessageDate date={createdAt} />
				</ChatMessageInfo>
				<ChatMessageActions>
					<Tooltip label="Copy message">
						<CopyIconButton content={gatheredText} />
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
	const createdAt = useMemo(() => new Date(message.createdAt), [message.createdAt]);

	const textContent = useMemo(() => {
		let gatheredText = "";

		for (const node of message.content) {
			if (node.type === "markdown") {
				gatheredText += node.data.content;
			}
		}

		return gatheredText;
	}, [message.content]);

	return (
		<ChatMessageContainer message={message} data-status={message.status}>
			<ChatMessageContent>
				{message.content.map((node, idx) => (
					<ChatNodeRenderer node={node} key={idx} />
				))}
			</ChatMessageContent>
			<ChatMessageFooter>
				<ChatMessageInfo>
					<ChatMessageDate date={createdAt} />
				</ChatMessageInfo>
				<ChatMessageActions>
					<Tooltip label="Copy message">
						<CopyIconButton content={textContent} />
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
