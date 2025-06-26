import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { ChatLog } from "../../../../features/chat/components/chat-log";
import { RenameChatDialog } from "../../../../features/chat/components/rename-chat-dialog";
import { useChatState } from "../../../../features/chat/hooks/common";
import { useDeleteChatMutation } from "../../../../features/chat/hooks/queries";
import { useChatStore } from "../../../../features/chat/stores";
import { addCommand, removeCommand } from "../../../../features/commands/utils";
import { showDialog } from "../../../../features/modals/utils";
import { useAnimationUnmount, useIsAtBottom } from "../../../../hooks/common";
import { useMainRouter } from "../../../../lib/trpc";

export const Route = createFileRoute("/_app/chat/$id/")({
	component: ChatPage,
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
	const navigate = useNavigate();
	const mainRouter = useMainRouter();
	const chatState = useChatState(params.id);
	const deleteChatMutation = useDeleteChatMutation();
	const scrollableRef = useRef<HTMLDivElement>(null);
	const hasScrolledToBottomOnLoad = useRef(false);

	const getChatQuery = useSuspenseQuery(
		mainRouter.chats.get.queryOptions({
			id: params.id,
		})
	);

	const chat = getChatQuery.data;
	const messages = chatState?.messages ?? [];

	const listChatMessagesQuery = useSuspenseQuery(
		mainRouter.chats.messages.list.queryOptions({
			chatId: params.id,
		})
	);

	const isAtBottom = useIsAtBottom({
		ref: scrollableRef,
		threshold: 25,
	});

	const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
		if (!scrollableRef.current) {
			return;
		}

		scrollableRef.current.scrollTo({
			top: scrollableRef.current.scrollHeight,
			behavior,
		});
	}, []);

	useEffect(() => {
		if (chatState) {
			return;
		}

		const chatStore = useChatStore.getState();

		// add the chat to the store
		chatStore.addChat(chat.id);

		// add the messages to the store
		for (const message of listChatMessagesQuery.data) {
			chatStore.addMessage(chat.id, {
				id: message.id,
				content: message.content,
				role: message.role,
				status: "complete",
				createdAt: message.createdAt,
			});
		}
	}, [chat, chatState, listChatMessagesQuery.data]);

	useEffect(() => {
		if (!hasScrolledToBottomOnLoad.current && messages.length > 0) {
			scrollToBottom("instant");

			hasScrolledToBottomOnLoad.current = true;
		}
	}, [messages]);

	useEffect(() => {
		if (hasScrolledToBottomOnLoad.current) {
			scrollToBottom();
		}
	}, [messages.length]);

	useEffect(() => {
		return () => {
			hasScrolledToBottomOnLoad.current = false;
		};
	}, [params.id]);

	useEffect(() => {
		addCommand({
			id: "rename-current-chat",
			name: "Rename current chat",
			execute: () => {
				showDialog({
					component: () => (
						<RenameChatDialog
							chat={{
								id: chat.id,
								name: chat.name,
							}}
						/>
					),
				});
			},
		});

		addCommand({
			id: "delete-current-chat",
			name: "Delete current chat",
			execute: () => {
				deleteChatMutation.mutate(
					{ id: chat.id },
					{
						onSuccess: () => {
							navigate({ to: "/chat" });
						},
					}
				);
			},
		});

		return () => {
			removeCommand("rename-current-chat");
			removeCommand("delete-current-chat");
		};
	}, [params.id]);

	const shouldShowSpacer = chatState?.userHasSentMessage && messages.length > 2;

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
