import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { useShallow } from "zustand/shallow";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useMessageList } from "../../../features/chat/hooks/use-message-list";
import { useChatStore } from "../../../features/chat/stores";
import { useAnimationUnmount, useIsAtBottom } from "../../../hooks/common";
import { useMainRouter } from "../../../lib/trpc";

export const Route = createFileRoute("/chat/$id/")({
	component: ChatPage,
	wrapInSuspense: true,
});

interface ScrollToBottomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	state: "visible" | "hidden";
}

const ScrollToBottomButton = ({ state, ...props }: ScrollToBottomButtonProps) => {
	const animationUnmount = useAnimationUnmount(state === "visible");

	if (!animationUnmount.shouldMount) {
		return null;
	}

	return (
		<button
			className="scroll-to-bottom-button"
			data-state={state}
			{...animationUnmount.props}
			{...props}
		>
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
	const hasScrolledToBottomOnLoad = useRef(false);

	const isAtBottom = useIsAtBottom({
		ref: scrollableRef,
		threshold: 25,
	});

	const chatStore = useChatStore(
		useShallow((state) => ({
			userHasSentMessage: state.userHasSentMessage,
			addMessage: state.addMessage,
			reset: state.reset,
		}))
	);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
		if (!scrollableRef.current) {
			return;
		}

		scrollableRef.current.scrollTo({
			top: scrollableRef.current.scrollHeight,
			behavior,
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
		if (messages.length === 0) {
			return;
		}

		if (hasScrolledToBottomOnLoad.current) {
			scrollToBottom();
		} else {
			scrollToBottom("instant");

			hasScrolledToBottomOnLoad.current = true;
		}
	}, [messages.length]);

	useEffect(() => {
		return () => {
			chatStore.reset();
		};
	}, [params.id]);

	const shouldShowSpacer = chatStore.userHasSentMessage && messages.length > 2;

	return (
		<div className="chat-page" data-is-at-bottom={isAtBottom}>
			<div className="chat-log-container" ref={scrollableRef}>
				<ChatLog messages={messages} />
				{shouldShowSpacer && <div className="chat-scroll-spacer" />}
			</div>
			<ScrollToBottomButton
				state={isAtBottom ? "hidden" : "visible"}
				onClick={() => scrollToBottom()}
			/>
		</div>
	);
}
