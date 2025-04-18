import type { PropsWithChildren } from "react";
import MarkdownToJsx from "markdown-to-jsx";
import { Markdown } from "../../markdown/components/markdown";
import type { ChatMessageType } from "../types";
import clsx from "clsx";
import "./chat-message.scss";
import { CodeBlock } from "../../markdown/components/code-block";

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
		<div
			className={clsx("chat-message", className)}
			data-message-id={message.id}
			data-message-role={message.role}
		>
			{children}
		</div>
	);
};

const UserChatMessage = ({ message }: ChatMessageProps) => {
	return (
		<ChatMessageContainer message={message} className="user-message">
			<p>{message.content}</p>
		</ChatMessageContainer>
	);
};

const AssistantChatMessage = ({ message }: ChatMessageProps) => {
	return (
		<ChatMessageContainer message={message} className={"assistant-message"}>
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

export const ChatMessage = ({ message }: ChatMessageProps) => {
	const Component = chatMessageRoleComponents[message.role];

	return <Component message={message} />;
};
