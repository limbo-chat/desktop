import { memo, type HTMLAttributes } from "react";
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

interface UserChatMessageRendererProps {
	message: UserChatMessageRenderer;
}

const UserChatMessageRenderer = ({ message }: UserChatMessageRendererProps) => {
	return (
		<ChatMessageContainer message={message}>
			{message.content.map((node, idx) => (
				<ChatNodeRenderer node={node} key={idx} />
			))}
		</ChatMessageContainer>
	);
};

interface AssistantChatMessageRendererProps {
	message: AssistantChatMessageRenderer;
}

const AssistantChatMessageRenderer = ({ message }: AssistantChatMessageRendererProps) => {
	return (
		<ChatMessageContainer message={message} data-status={message.status}>
			{message.content.map((node, idx) => (
				<ChatNodeRenderer node={node} key={idx} />
			))}
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
