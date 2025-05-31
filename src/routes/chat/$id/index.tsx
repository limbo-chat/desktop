import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, type ButtonHTMLAttributes } from "react";
import { useShallow } from "zustand/shallow";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useMessageList } from "../../../features/chat/hooks/use-message-list";
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
	const messages = useMessageList();
	const scrollableRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const hasScrolledToBottomOnLoad = useRef(false);

	const isAtBottom = useIsAtBottom({
		ref: scrollableRef,
		threshold: 25,
	});

	const chatStore = useChatStore(
		useShallow((state) => ({
			addMessage: state.addMessage,
			reset: state.reset,
		}))
	);

	const scrollToBottom = useCallback(() => {
		if (!scrollableRef.current) {
			return;
		}

		scrollableRef.current.scrollTo({
			top: scrollableRef.current.scrollHeight,
		});
	}, []);

	const listChatMessagesQuery = useSuspenseQuery(
		mainRouter.chats.messages.list.queryOptions({
			chatId: params.id,
		})
	);

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
	}, [listChatMessagesQuery.data]);

	useEffect(() => {
		if (messages.length > 0 && hasScrolledToBottomOnLoad.current === false) {
			scrollToBottom();

			hasScrolledToBottomOnLoad.current = true;
		}
	}, [messages]);

	useEffect(() => {
		return () => {
			chatStore.reset();
		};
	}, [params.id]);

	return (
		<div className="chat-page" data-is-at-bottom={isAtBottom}>
			<div className="chat-log-container" ref={scrollableRef}>
				<ChatLog messages={messages} />
			</div>
			<ScrollToBottomButton
				state={isAtBottom ? "hidden" : "visible"}
				onClick={scrollToBottom}
			/>
		</div>
	);
}
