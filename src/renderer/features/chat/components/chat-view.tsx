import { useSuspenseQuery } from "@tanstack/react-query";
import { useMeasure } from "@uidotdev/usehooks";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { addCommand, removeCommand } from "../../../features/commands/utils";
import { showDialog } from "../../../features/modals/utils";
import { useAnimationUnmount, useIsAtBottom } from "../../../hooks/common";
import { useMainRouter, useMainRouterClient } from "../../../lib/trpc";
import { usePluginManager } from "../../plugins/hooks/core";
import { getEnabledToolIds } from "../../storage/utils";
import { useChatState } from "../hooks/common";
import { useDeleteChatMutation } from "../hooks/queries";
import { useSendMessage } from "../hooks/use-send-message";
import { useChatStore } from "../stores";
import { renderSystemPrompt } from "../utils";
import { ChatComposer } from "./chat-composer";
import { ChatLog } from "./chat-log";
import { RenameChatDialog } from "./rename-chat-dialog";

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

export interface ChatViewProps {
	chatId: string;
}

export const ChatView = ({ chatId }: ChatViewProps) => {
	const mainRouterClient = useMainRouterClient();
	const mainRouter = useMainRouter();
	const pluginManager = usePluginManager();
	const chatState = useChatState(chatId);
	const deleteChatMutation = useDeleteChatMutation();
	const { sendMessage, cancelResponse } = useSendMessage();

	const [userMessage, setUserMessage] = useState("");
	const [selectedChatLLMId, setSelectedChatLLMId] = useState<string | null>(null);

	const [chatComposerRef, chatComposerDimensions] = useMeasure();
	const chatLogContainerRef = useRef<HTMLDivElement>(null);
	const hasScrolledToBottomOnLoad = useRef(false);

	const getChatQuery = useSuspenseQuery(
		mainRouter.chats.get.queryOptions({
			id: chatId,
		})
	);

	const chat = getChatQuery.data;
	const messages = chatState?.messages ?? [];

	const listChatMessagesQuery = useSuspenseQuery(
		mainRouter.chats.messages.list.queryOptions({
			chatId: chatId,
		})
	);

	const isAtBottom = useIsAtBottom({
		ref: chatLogContainerRef,
		threshold: 25,
	});

	const shouldShowSpacer = !!chatState && chatState.userHasSentMessage && messages.length > 2;

	const areChatComposerDimensionsAvailable =
		typeof chatComposerDimensions.width === "number" &&
		typeof chatComposerDimensions.height === "number";

	const handleSend = useCallback(async () => {
		if (!selectedChatLLMId) {
			return;
		}

		const llm = pluginManager.getLLM(selectedChatLLMId);

		if (!llm) {
			return;
		}

		// form.reset();

		// old chat creation logic

		// let chatId;

		// const newChat = await createChatMutation.mutateAsync({
		// 	name: "New chat",
		// });

		// add the new chat to the store
		// chatStore.addChat(newChat.id);
		// chatId = newChat.id;
		// await pluginManager.executeOnChatCreatedHooks({
		// 	chatId: newChat.id,
		// });
		// await router.navigate({
		// 	to: "/chat/$id",
		// 	params: {
		// 		id: newChat.id.toString(),
		// 	},
		// });

		const userMessageCopy = userMessage;

		setUserMessage("");

		try {
			// get the settings frmo the main process
			const settings = await mainRouterClient.settings.get.query();
			const systemPromptTemplate = settings.systemPrompt;
			const enabledToolIds = getEnabledToolIds();

			// reconsider whether it should be trimmed or not
			const systemPrompt = renderSystemPrompt(systemPromptTemplate, {
				user: {
					username: settings.username,
				},
			}).trim();

			await sendMessage({
				chatId: chatId,
				llm,
				systemPrompt,
				enabledToolIds,
				message: userMessage,
			});
		} catch (err) {
			// todo indicate error better
			console.error("Failed to send message:", err);

			setUserMessage(userMessageCopy);
		}
	}, [chatId, userMessage]);

	const handleCancel = useCallback(() => {
		cancelResponse(chatId);
	}, [chatId]);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
		if (!chatLogContainerRef.current) {
			return;
		}

		chatLogContainerRef.current.scrollTo({
			top: chatLogContainerRef.current.scrollHeight,
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
							// todo
							// delete the chat
							// clear the current chat
						},
					}
				);
			},
		});

		return () => {
			removeCommand("rename-current-chat");
			removeCommand("delete-current-chat");
		};
	}, [chatId]);

	useEffect(() => {
		if (
			!hasScrolledToBottomOnLoad.current &&
			messages.length > 0 &&
			areChatComposerDimensionsAvailable
		) {
			scrollToBottom();

			hasScrolledToBottomOnLoad.current = true;
		}
	}, [messages.length, areChatComposerDimensionsAvailable]);

	return (
		<div
			className="chat-view"
			data-is-at-bottom={isAtBottom}
			style={{
				// @ts-expect-error
				"--chat-composer-height": chatComposerDimensions.height + "px",
				"--chat-composer-width": chatComposerDimensions.width + "px",
			}}
		>
			<div className="chat-log-container" ref={chatLogContainerRef}>
				<ChatLog messages={messages} />
				{shouldShowSpacer && <div className="chat-scroll-spacer" />}
			</div>
			<ScrollToBottomButton
				state={isAtBottom ? "hidden" : "visible"}
				onClick={() => scrollToBottom()}
			/>
			<ChatComposer
				isPending={false}
				value={userMessage}
				onValueChange={setUserMessage}
				selectedLLMId={selectedChatLLMId}
				onSelectedLLMIdChange={setSelectedChatLLMId}
				onSend={handleSend}
				onCancel={handleCancel}
				ref={chatComposerRef}
			/>
		</div>
	);
};
