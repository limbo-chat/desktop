import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowUpIcon, CircleStopIcon } from "lucide-react";
import type { Ref } from "react";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useShallow } from "zustand/shallow";
import { IconButton } from "../../../components/icon-button";
import { useChatState } from "../../../features/chat/hooks/common";
import { useCreateChatMutation } from "../../../features/chat/hooks/queries";
import { useSendMessage } from "../../../features/chat/hooks/use-send-message";
import { useChatStore } from "../../../features/chat/stores";
import { renderSystemPrompt } from "../../../features/chat/utils";
import { usePluginManager } from "../../../features/plugins/hooks/core";
import { useLocalStore } from "../../../features/storage/stores";
import { getEnabledToolIds } from "../../../features/storage/utils";
import { useMainRouterClient } from "../../../lib/trpc";
import { ChatLLMPicker } from "./chat-llm-picker";
import { ChatToolsMenu } from "./chat-tools-menu";

export interface ChatComposerProps {
	ref?: Ref<HTMLDivElement>;
}

export const ChatComposer = ({ ref }: ChatComposerProps) => {
	const router = useRouter();
	const mainRouter = useMainRouterClient();
	const pluginManager = usePluginManager();
	const { sendMessage, cancelResponse } = useSendMessage();
	const createChatMutation = useCreateChatMutation();

	const params = useParams({
		strict: false,
	});

	const chatState = useChatState(params.id);

	const form = useForm({
		defaultValues: {
			message: "",
		},
	});

	const localStore = useLocalStore(
		useShallow((state) => ({
			selectedModel: state.selectedChatLLMId,
		}))
	);

	const onSubmit = form.handleSubmit(async (data) => {
		if (!localStore.selectedModel) {
			return;
		}

		const llm = pluginManager.getLLM(localStore.selectedModel);

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

			// render the handlebars template
			const systemPrompt = renderSystemPrompt(systemPromptTemplate, {
				user: {
					username: settings.username,
				},
			});

			const enabledToolIds = getEnabledToolIds();

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
			console.log(params.id);

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
				<ChatLLMPicker />
				<ChatToolsMenu />
			</div>
		</div>
	);
};
