import { useMemo } from "react";
import { formatRelative } from "date-fns";
import { CopyIconButton } from "../../../components/copy-icon-button";
import { Tooltip } from "../../../components/tooltip";
import { ChatNodeRenderer } from "../../chat-nodes/components/chat-node-renderer";
import type { ChatMessageType } from "../types";

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

export interface ChatMessageProps {
	message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
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

	const status = message.role === "assistant" ? message.status : undefined;

	return (
		<ChatMessageContainer message={message} data-status={status}>
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
