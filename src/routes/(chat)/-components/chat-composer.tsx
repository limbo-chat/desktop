import { useParams, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useChatStore } from "../../../features/chat/stores";
import { Button } from "../../../components/button";
import { ArrowUpIcon } from "lucide-react";
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

	return (
		<form className="chat-composer" onSubmit={onSubmit}>
			<textarea
				className="chat-composer__input"
				placeholder="Type your message here..."
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();

						onSubmit();
					}
				}}
				{...form.register("message", {
					required: true,
					minLength: 1,
				})}
			/>
			<Button type="submit" size="icon" color="secondary">
				<ArrowUpIcon size={20} />
			</Button>
		</form>
	);
};
