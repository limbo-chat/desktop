import { useEffect } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { useChatStore } from "../../../features/chat/stores";
import { Button } from "../../../components/button";
import { ArrowUpIcon } from "lucide-react";
import { SimpleSelect, SimpleSelectItem } from "../../../components/select";
import { createListCollection } from "@ark-ui/react";
import TextareaAutosize from "react-textarea-autosize";
import "./chat-composer.scss";

export const ChatComposer = () => {
	const router = useRouter();

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

		const chatStore = useChatStore.getState();

		form.reset();

		chatStore.addMessage({
			id: Date.now(),
			role: "user",
			content: data.message,
		});

		// chatStore.addMessage({
		// 	id: Date.now() + 1,
		// 	role: "assistant",
		// 	content: "",
		// });

		// sendMessageMutation.mutate(
		// 	{
		// 		message: data.message,
		// 	},
		// 	{
		// 		onError: (err) => {
		// 			console.log("failed to generate AI response", err);

		// 			form.reset({
		// 				message: data.message,
		// 			});
		// 		},
		// 	}
		// );
	});

	const tempCollection = createListCollection({
		items: ["gpt4o", "gpt4", "gpt3.5"],
	});

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
				<Button type="submit" size="icon" color="secondary">
					<ArrowUpIcon size={20} />
				</Button>
			</form>
			<div className="chat-composer-accessories">
				<SimpleSelect
					className="chat-model-select"
					placeholder="Select model"
					collection={tempCollection}
				>
					{tempCollection.items.map((item) => (
						<SimpleSelectItem item={item} label={item} key={item} />
					))}
				</SimpleSelect>
			</div>
		</div>
	);
};
