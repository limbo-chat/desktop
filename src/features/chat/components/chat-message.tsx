import { memo, type HTMLAttributes, type PropsWithChildren } from "react";
import MarkdownToJsx from "markdown-to-jsx";
import { Markdown } from "../../markdown/components/markdown";
import type { AssistantChatMessage, ChatMessageType, UserChatMessage } from "../types";
import clsx from "clsx";
import { CodeBlock } from "../../markdown/components/code-block";

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
			<p>{message.content}</p>
		</ChatMessageContainer>
	);
};

interface AssistantChatMessageProps {
	message: AssistantChatMessage;
}

const AssistantChatMessage = ({ message }: AssistantChatMessageProps) => {
	return (
		<ChatMessageContainer
			message={message}
			className={"assistant-message"}
			data-status={message.status}
		>
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
					{message.content}
				</MarkdownToJsx>
			</Markdown>
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
