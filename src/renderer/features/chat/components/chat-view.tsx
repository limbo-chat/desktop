import { useQuery } from "@tanstack/react-query";
import { useMeasure } from "@uidotdev/usehooks";
import { debounce } from "es-toolkit";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import type { UpdateChatInput } from "../../../../main/trpc/router/chats";
import { useAnimationUnmount, useIsAtBottom } from "../../../hooks/common";
import { useMainRouter, useMainRouterClient } from "../../../lib/trpc";
import { ChatPanelRenderer } from "../../chat-panels/components/chat-panel-renderer";
import { useActiveChatPanel } from "../../chat-panels/hooks";
import { useActiveChatPanelStore } from "../../chat-panels/stores";
import { usePluginManager } from "../../plugins/hooks/core";
import { useChatState } from "../hooks/common";
import { useSendMessage } from "../hooks/use-send-message";
import { useChatStore } from "../stores";
import { renderSystemPrompt } from "../utils";
import { ChatComposer } from "./chat-composer";
import { ChatLog } from "./chat-log";

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
	const activeChatPanel = useActiveChatPanel();
	const { sendMessage, cancelResponse } = useSendMessage();

	const [userMessage, setUserMessage] = useState("");
	const [selectedLLMId, setSelectedLLMId] = useState<string | null>(null);
	const [enabledToolIds, setEnabledToolIds] = useState<string[]>([]);

	const [chatComposerRef, chatComposerDimensions] = useMeasure();
	const chatLogContainerRef = useRef<HTMLDivElement>(null);
	const hasScrolledToBottomOnLoad = useRef(false);

	const getChatQuery = useQuery(
		mainRouter.chats.get.queryOptions({
			id: chatId,
		})
	);

	const chat = getChatQuery.data;
	const messages = chatState?.messages ?? [];

	const listChatMessagesQuery = useQuery(
		mainRouter.chats.messages.list.queryOptions({
			chatId,
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
		if (!selectedLLMId) {
			return;
		}

		const llm = pluginManager.getLLM(selectedLLMId);

		if (!llm) {
			return;
		}

		const userMessageCopy = userMessage;

		setUserMessage("");

		try {
			// get the settings frmo the main process
			const settings = await mainRouterClient.settings.get.query();
			const systemPromptTemplate = settings.systemPrompt;

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
			console.error("Failed to send message:", err);

			setUserMessage(userMessageCopy);
		}
	}, [chatId, userMessage, selectedLLMId]);

	const handleCancel = useCallback(() => {
		cancelResponse(chatId);
	}, [chatId]);

	const updateChat = useCallback(
		debounce(async (data: UpdateChatInput["data"]) => {
			await mainRouterClient.chats.update.mutate({
				id: chatId,
				data,
			});
		}, 500),
		[chatId]
	);

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
		return () => {
			setUserMessage("");
			setSelectedLLMId(null);
			setEnabledToolIds([]);

			hasScrolledToBottomOnLoad.current = false;

			const activeChatPanelStore = useActiveChatPanelStore.getState();

			// if this chat has a panel open, close it
			if (activeChatPanelStore.activeChatPanel) {
				activeChatPanelStore.clearActiveChatPanel();
			}
		};
	}, [chatId]);

	useEffect(() => {
		if (chat) {
			if (chat.userMessageDraft) {
				setUserMessage(chat.userMessageDraft);
			}

			if (chat.llmId) {
				setSelectedLLMId(chat.llmId);
			}

			if (chat.enabledToolIds.length > 0) {
				setEnabledToolIds(chat.enabledToolIds);
			}
		}
	}, [chat]);

	useEffect(() => {
		updateChat({
			userMessageDraft: userMessage,
			llmId: selectedLLMId,
			enabledToolIds,
		});
	}, [chatId, userMessage, selectedLLMId, enabledToolIds]);

	useEffect(() => {
		if (chatState || !chat || !listChatMessagesQuery.data) {
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
		if (
			!hasScrolledToBottomOnLoad.current &&
			areChatComposerDimensionsAvailable &&
			messages.length > 0
		) {
			scrollToBottom();

			hasScrolledToBottomOnLoad.current = true;
		}
	}, [messages, areChatComposerDimensionsAvailable]);

	return (
		<PanelGroup
			className="chat-view"
			direction="horizontal"
			data-is-at-bottom={isAtBottom}
			style={{
				// @ts-expect-error
				"--chat-composer-height": (chatComposerDimensions.height ?? 0) + "px",
				"--chat-composer-width": (chatComposerDimensions.width ?? 0) + "px",
			}}
		>
			<Panel className="chat-view-main">
				<div className="chat-log-container" ref={chatLogContainerRef}>
					<ChatLog messages={messages} />
					{shouldShowSpacer && <div className="chat-scroll-spacer" />}
				</div>
				<ScrollToBottomButton
					state={messages.length > 0 && !isAtBottom ? "visible" : "hidden"}
					onClick={() => scrollToBottom()}
				/>
				<ChatComposer
					isPending={false}
					value={userMessage}
					onValueChange={setUserMessage}
					selectedLLMId={selectedLLMId}
					onSelectedLLMIdChange={setSelectedLLMId}
					enabledToolIds={enabledToolIds}
					onEnabledToolIdsChange={setEnabledToolIds}
					onSend={handleSend}
					onCancel={handleCancel}
					ref={chatComposerRef}
				/>
			</Panel>
			{activeChatPanel && (
				<>
					<PanelResizeHandle className="resize-handle" />
					<Panel className="chat-view-panel">
						<ChatPanelRenderer
							chatPanelId={activeChatPanel.id}
							chatPanelData={activeChatPanel.data ?? {}}
						/>
					</Panel>
				</>
			)}
		</PanelGroup>
	);
};
