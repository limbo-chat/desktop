import type { PropsWithChildren } from "react";
import { Markdown } from "../../markdown/components/markdown";
import type { ChatMessageType } from "../types";
import { Text } from "../../../components/text";
import clsx from "clsx";

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
		<ChatMessageContainer
			message={message}
			className={clsx(
				"self-end p-md rounded-md bg-surface border border-border max-w-[80%]",
				className
			)}
		>
			<Text>{message.content}</Text>
		</ChatMessageContainer>
	);
};

const AssistantChatMessage = ({ message, className }: ChatMessageProps) => {
	return (
		<ChatMessageContainer message={message} className={className}>
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
