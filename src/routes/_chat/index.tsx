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
import { TextInput } from "../../components/text-input";

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
		<div className="flex min-h-svh">
			<Sidebar />
			<div className="h-[100svh] flex flex-col flex-1">
				<div className="overflow-y-auto flex-1">
					<ChatLog className="mx-auto w-full max-w-[75ch]" messages={messages} />
				</div>
				<div className="mx-auto max-h-[400px] w-full max-w-[80ch] p-md border-t border-l border-r border-border bg-surface-alt rounded-t-md">
					<form className="flex" onSubmit={onSubmit}>
						<textarea
							className="flex-1 resize-none outline-none overflow-y-auto"
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
