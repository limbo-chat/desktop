import { useMemo } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { SimpleSelect, SimpleSelectItem } from "../../../components/select";
import { createListCollection } from "@ark-ui/react";
import { useShallow } from "zustand/shallow";
import TextareaAutosize from "react-textarea-autosize";
import { usePluginManager, usePlugins } from "../../../features/plugins/hooks";
import { IconButton } from "../../../components/icon-button";
import { useSendMessage } from "../../../features/chat/hooks/use-send-message";
import { useLocalStore } from "../../../features/storage/stores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import { useChatStore } from "../../../features/chat/stores";

export const ChatComposer = () => {
	const pluginManager = usePluginManager();
	const router = useRouter();
	const plugins = usePlugins();
	const queryClient = useQueryClient();
	const sendMessage = useSendMessage();
	const mainRouter = useMainRouter();
	const createChatMutation = useMutation(mainRouter.chats.create.mutationOptions());

	// may need to read more from chat store here later, that's why I'm ising useShallow, even if it's unecessary for now
	const chatStore = useChatStore(
		useShallow((state) => ({
			isAssistantResponsePending: state.isAssistantResponsePending,
		}))
	);

	const localStore = useLocalStore(
		useShallow((state) => ({
			selectedModel: state.selectedModel,
			setSelectedModel: state.setSelectedModel,
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

		form.reset();

		let chatId;

		if (typeof params.id === "string") {
			chatId = params.id;
		} else {
			const newChat = await createChatMutation.mutateAsync({
				title: "New chat",
			});

			queryClient.invalidateQueries(mainRouter.chats.list.queryFilter());

			chatId = newChat.id;

			await pluginManager.executeOnAfterChatCreatedHooks({
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
				chatId: chatId,
				message: data.message,
			});
		} catch (err) {
			// If sending message fails, we can add the message back to the form
			form.setValue("message", data.message);
		}
	});

	// temp
	const llmCollection = useMemo(() => {
		const items = plugins.flatMap((plugin) => {
			const pluginLLMs = plugin.getRegisteredLLMs();

			return pluginLLMs.map((llm) => ({
				label: llm.name,
				value: {
					pluginId: plugin.manifest.id,
					modelId: llm.id,
				},
			}));
		});

		return createListCollection({
			items,
			itemToValue: (item) => `${item.value.pluginId}/${item.value.modelId}`,
		});
	}, [plugins]);

	const message = form.watch("message");
	const canSendMessage = message.length > 0 && !chatStore.isAssistantResponsePending;

	return (
		<div className="chat-composer">
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
				<SimpleSelect
					className="chat-model-select"
					placeholder="Select model"
					collection={llmCollection}
					value={localStore.selectedModel ? [localStore.selectedModel] : []}
					onValueChange={(e) => localStore.setSelectedModel(e.value[0])}
				>
					{llmCollection.items.map((item) => (
						<SimpleSelectItem
							item={item}
							label={item.label}
							key={`${item.value.pluginId}/${item.value.modelId}`}
						/>
					))}
				</SimpleSelect>
			</div>
		</div>
	);
};
