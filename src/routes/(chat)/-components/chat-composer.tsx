import { useMemo } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { ArrowUpIcon } from "lucide-react";
import { SimpleSelect, SimpleSelectItem } from "../../../components/select";
import { createListCollection } from "@ark-ui/react";
import TextareaAutosize from "react-textarea-autosize";
import { usePlugins } from "../../../features/plugins/hooks";
import { IconButton } from "../../../components/icon-button";
import { useSendMessage } from "../../../features/chat/hooks";
import "./chat-composer.scss";

export const ChatComposer = () => {
	const router = useRouter();
	const plugins = usePlugins();
	const sendMessage = useSendMessage();

	const params = useParams({
		strict: false,
	});

	const form = useForm({
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		// TODO, create new chat ID for the chat
		if (params.id === undefined) {
			router.navigate({
				to: "/$id",
				params: {
					id: "temp",
				},
			});
		}

		sendMessage(data.message);

		form.reset();
	});

	// temp
	const llmCollection = useMemo(() => {
		const items = plugins.flatMap((plugin) => {
			const pluginLLMs = plugin.getRegisteredLLMs();

			return pluginLLMs.map((llm) => ({
				value: llm.id,
				label: llm.name,
			}));
		});

		return createListCollection({
			items,
		});
	}, []);

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
				<IconButton color="secondary">
					<ArrowUpIcon size={20} />
				</IconButton>
			</form>
			<div className="chat-composer-accessories">
				<SimpleSelect
					className="chat-model-select"
					placeholder="Select model"
					collection={llmCollection}
				>
					{llmCollection.items.map((item) => (
						<SimpleSelectItem item={item} label={item.label} key={item.value} />
					))}
				</SimpleSelect>
			</div>
		</div>
	);
};
