import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { ChatLog } from "../../features/chat/components/chat-log";
import { Sidebar } from "./-components/sidebar";
import { useChatMessages, useLLMChunkSubscriber } from "../../features/chat/hooks";
import { useMainRouter } from "../../lib/trpc";
import { useChatStore } from "../../features/chat/stores";
import "./styles.scss";

export const Route = createFileRoute("/_chat/")({
	component: ChatPage,
});

function ChatPage() {
	const messages = useChatMessages();

	const mainRouter = useMainRouter();
	const sendMessageMutation = useMutation(mainRouter.chats.sendMessage.mutationOptions());

	const form = useForm({
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		const chatStore = useChatStore.getState();

		form.reset();

		chatStore.addMessage({
			id: Date.now(),
			role: "user",
			content: data.message,
		});

		chatStore.addMessage({
			id: Date.now() + 1,
			role: "assistant",
			content: "",
		});

		sendMessageMutation.mutate(
			{
				message: data.message,
			},
			{
				onError: (err) => {
					console.log("failed to generate AI response", err);

					form.reset({
						message: data.message,
					});
				},
			}
		);
	});

	useLLMChunkSubscriber();

	return (
		<div className="app-layout">
			<Sidebar />
			<div className="chat-content">
				<div className="chat-log-container">
					<ChatLog className="main-chat-log" messages={messages} />
				</div>

				<div className="chat-controls">
					<form className="chat-controls__input-row" onSubmit={onSubmit}>
						<textarea
							className="chat-controls__input"
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
						<div>
							<Button type="submit" size="icon" color="secondary">
								<ArrowUpIcon size={20} />
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
