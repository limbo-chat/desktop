import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowUpIcon, CircleStopIcon } from "lucide-react";
import { useState, type Ref } from "react";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../../../../components/button";
import { IconButton } from "../../../../components/icon-button";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../../../../components/popover";
import { useChatState } from "../../../../features/chat/hooks/common";
import { useCreateChatMutation } from "../../../../features/chat/hooks/queries";
import { useSendMessage } from "../../../../features/chat/hooks/use-send-message";
import { useChatStore } from "../../../../features/chat/stores";
import { renderSystemPrompt } from "../../../../features/chat/utils";
import { RegisteredLLMPicker } from "../../../../features/llms/components/llm-picker";
import { useMaybeLLM } from "../../../../features/llms/hooks";
import { usePluginManager } from "../../../../features/plugins/hooks/core";
import { useSelectedChatLLMId } from "../../../../features/storage/hooks";
import { getEnabledToolIds, setSelectedChatLLMId } from "../../../../features/storage/utils";
import { useMainRouterClient } from "../../../../lib/trpc";
import { ChatToolsMenu } from "./chat-tools-menu";

export interface ChatComposerProps {
	ref?: Ref<HTMLDivElement>;
}

export const ChatComposer = ({ ref }: ChatComposerProps) => {
	const router = useRouter();
	const mainRouter = useMainRouterClient();
	const pluginManager = usePluginManager();
	const createChatMutation = useCreateChatMutation();
	const selectedChatLLMId = useSelectedChatLLMId();
	const selectedChatLLM = useMaybeLLM(selectedChatLLMId);
	const { sendMessage, cancelResponse } = useSendMessage();
	const [isChatPickerOpen, setIsChatPickerOpen] = useState(false);

	const params = useParams({
		strict: false,
	});

	const chatState = useChatState(params.id);

	const form = useForm({
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		if (!selectedChatLLMId) {
			return;
		}

		const llm = pluginManager.getLLM(selectedChatLLMId);

		if (!llm) {
			// todo indicate error
			return;
		}

		form.reset();

		let chatId;

		if (typeof params.id === "string") {
			chatId = params.id;
		} else {
			const newChat = await createChatMutation.mutateAsync({
				name: "New chat",
			});

			const chatStore = useChatStore.getState();

			// add the new chat to the store
			chatStore.addChat(newChat.id);

			chatId = newChat.id;

			await pluginManager.executeOnChatCreatedHooks({
				chatId: newChat.id,
			});

			await router.navigate({
				to: "/chat/$id",
				params: {
					id: newChat.id.toString(),
				},
			});
		}

		try {
			// get the settings frmo the main process
			const settings = await mainRouter.settings.get.query();
			const systemPromptTemplate = settings.systemPrompt;

			const enabledToolIds = getEnabledToolIds();

			// render the handlebars template
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
				message,
			});
		} catch (err) {
			console.error("Failed to send message:", err);

			// If sending message fails, we can add the message back to the form
			form.setValue("message", message);
		}
	});

	const message = form.watch("message");
	const canSendMessage = message.length > 0;
	const canCancelResponse = chatState?.isAssistantResponsePending;

	const handleSubmitClick = () => {
		if (canCancelResponse) {
			if (params.id) {
				cancelResponse(params.id);
			}
		} else {
			onSubmit();
		}
	};

	return (
		<div className="chat-composer" ref={ref}>
			<form className="chat-composer-form">
				<Controller
					name="message"
					control={form.control}
					rules={{
						minLength: 1,
					}}
					render={({ field }) => (
						<TextareaAutosize
							autoFocus
							className="chat-composer-input"
							placeholder="Type your message here..."
							value={field.value}
							onBlur={field.onBlur}
							onChange={(e) => field.onChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();

									if (!canCancelResponse) {
										onSubmit();
									}
								}
							}}
						/>
					)}
				/>
				<IconButton
					disabled={!canSendMessage && !canCancelResponse}
					onClick={(e) => {
						e.preventDefault();
						handleSubmitClick();
					}}
				>
					{canCancelResponse ? <CircleStopIcon /> : <ArrowUpIcon />}
				</IconButton>
			</form>
			<div className="chat-composer-accessories">
				<PopoverRoot open={isChatPickerOpen} onOpenChange={setIsChatPickerOpen}>
					<PopoverTrigger asChild>
						<Button>{selectedChatLLM ? selectedChatLLM.name : "Select llm"}</Button>
					</PopoverTrigger>
					<PopoverContent>
						<RegisteredLLMPicker
							onChange={(selectedId) => {
								setSelectedChatLLMId(selectedId);
								setIsChatPickerOpen(false);
							}}
						/>
					</PopoverContent>
				</PopoverRoot>
				<ChatToolsMenu />
			</div>
		</div>
	);
};
