import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowUpIcon } from "lucide-react";
import type { Ref } from "react";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useShallow } from "zustand/shallow";
import { IconButton } from "../../../components/icon-button";
import { useCreateChatMutation } from "../../../features/chat/hooks/queries";
import { useSendMessage } from "../../../features/chat/hooks/use-send-message";
import { useChatStore } from "../../../features/chat/stores";
import { usePluginManager } from "../../../features/plugins/hooks/core";
import { useLocalStore } from "../../../features/storage/stores";
import { getEnabledToolIds } from "../../../features/storage/utils";
import { ChatLLMPicker } from "./chat-llm-picker";
import { ChatToolsMenu } from "./chat-tools-menu";

export interface ChatComposerProps {
	ref?: Ref<HTMLDivElement>;
}

export const ChatComposer = ({ ref }: ChatComposerProps) => {
	const router = useRouter();
	const pluginManager = usePluginManager();
	const sendMessage = useSendMessage();
	const createChatMutation = useCreateChatMutation();

	// may need to read more from chat store here later, that's why I'm ising useShallow, even if it's unecessary for now
	const chatStore = useChatStore(
		useShallow((state) => ({
			isAssistantResponsePending: state.isAssistantResponsePending,
		}))
	);

	const localStore = useLocalStore(
		useShallow((state) => ({
			selectedModel: state.selectedChatLLMId,
		}))
	);

	const params = useParams({
		strict: false,
	});

	const form = useForm({
		defaultValues: {
			message: "",
		},
	});

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
			await sendMessage({
				llm,
				chatId: chatId,
				message: data.message,
				enabledToolIds: getEnabledToolIds(),
			});
		} catch (err) {
			// If sending message fails, we can add the message back to the form
			form.setValue("message", data.message);
		}
	});

	const message = form.watch("message");
	const canSendMessage = message.length > 0 && !chatStore.isAssistantResponsePending;

	return (
		<div className="chat-composer" ref={ref}>
			<form className="chat-composer-form" onSubmit={onSubmit}>
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

									onSubmit();
								}
							}}
						/>
					)}
				></Controller>
				<IconButton type="submit" color="secondary" disabled={!canSendMessage}>
					<ArrowUpIcon />
				</IconButton>
			</form>
			<div className="chat-composer-accessories">
				<ChatLLMPicker />
				<ChatToolsMenu />
			</div>
		</div>
	);
};
