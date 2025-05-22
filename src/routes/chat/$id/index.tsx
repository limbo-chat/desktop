import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { useShallow } from "zustand/shallow";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useChatStore } from "../../../features/chat/stores";
import { useIsAtBottom } from "../../../hooks/common";
import { useMainRouter } from "../../../lib/trpc";

export const Route = createFileRoute("/chat/$id/")({
	component: ChatPage,
	wrapInSuspense: true,
});

interface ScrollToBottomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	state: "visible" | "hidden";
}

const ScrollToBottomButton = ({ state, ...props }: ScrollToBottomButtonProps) => {
	return (
		<button className="scroll-to-bottom-button" data-state={state} {...props}>
			<span className="scroll-to-bottom-button-text">Scroll to bottom</span>
			<ChevronDown className="scroll-to-bottom-button-icon" />
		</button>
	);
};

function ChatPage() {
	const params = Route.useParams();
	const mainRouter = useMainRouter();
	const scrollableRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		if (!scrollableRef.current) {
			return;
		}

		scrollableRef.current.scrollTo({
			top: scrollableRef.current.scrollHeight,
		});
	}, []);

	const isAtBottom = useIsAtBottom({
		ref: scrollableRef,
		threshold: 25,
	});

	const chatStore = useChatStore(
		useShallow((state) => ({
			messages: state.messages,
			addMessage: state.addMessage,
			reset: state.reset,
		}))
	);

	const listChatMessagesQuery = useSuspenseQuery(
		mainRouter.chats.messages.list.queryOptions({
			chatId: params.id,
		})
	);

	useEffect(() => {
		return () => {
			chatStore.reset();
		};
	}, [params.id]);

	useEffect(() => {
		for (const message of listChatMessagesQuery.data) {
			chatStore.addMessage({
				id: message.id,
				content: message.content,
				role: message.role,
				status: "complete",
				createdAt: message.createdAt,
			});
		}

		// this is very hacky and must be fixed, but I literally have tried everything else
		// problem: The chat-log-container must be scrolled to the bottom of after the messages are rendered
		setTimeout(() => {
			scrollToBottom();
		}, 100);
	}, [listChatMessagesQuery.data]);

	return (
		<>
			<div className="chat-log-container" ref={scrollableRef}>
				<ChatLog messages={chatStore.messages} />
			</div>
			<ScrollToBottomButton
				state={isAtBottom ? "hidden" : "visible"}
				onClick={scrollToBottom}
			/>
		</>
	);
}
