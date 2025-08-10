import clsx from "clsx";
import type { ChatMessageType } from "../types";
import { ChatMessage } from "./chat-message";

export interface ChatLogProps extends React.ComponentProps<"div"> {
	messages: ChatMessageType[];
}

export const ChatLog = ({ messages, className, ...divProps }: ChatLogProps) => {
	return (
		<div className={clsx("chat-log", className)} {...divProps}>
			{messages.map((message) => (
				<ChatMessage message={message} key={message.id} />
			))}
		</div>
	);
};
