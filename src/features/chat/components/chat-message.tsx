import type { PropsWithChildren } from "react";
import { Markdown } from "../../markdown/components/markdown";
import type { ChatMessageType } from "../types";
import clsx from "clsx";
import { Text } from "../../../components/text";
import "./chat-message.scss";

export interface ChatMessageProps {
	message: ChatMessageType;
	className?: string;
}

const ChatMessageContainer = ({
	message,
	className,
	children,
}: PropsWithChildren<ChatMessageProps>) => {
	return (
		<div className={className} data-message-id={message.id} data-message-role={message.role}>
			{children}
		</div>
	);
};

const UserChatMessage = ({ message, className }: ChatMessageProps) => {
	return (
		<ChatMessageContainer message={message} className={clsx("chat-message--user", className)}>
			<Text>{message.content}</Text>
		</ChatMessageContainer>
	);
};

const AssistantChatMessage = ({ message, className }: ChatMessageProps) => {
	return (
		<ChatMessageContainer
			message={message}
			className={clsx("chat-message--assistant", className)}
		>
			<Markdown content={message.content} />
		</ChatMessageContainer>
	);
};

const chatMessageRoleComponents = {
	user: UserChatMessage,
	assistant: AssistantChatMessage,
} as const;

export const ChatMessage = ({ message }: ChatMessageProps) => {
	const Component = chatMessageRoleComponents[message.role];

	return <Component message={message} />;
};
