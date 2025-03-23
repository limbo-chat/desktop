import type { ChatMessageType } from "../types";
import { ChatMessage } from "./chat-message";
import type { HTMLAttributes } from "react";
import clsx from "clsx";
import "./chat-log.scss";

export interface ChatLogProps extends HTMLAttributes<HTMLDivElement> {
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
