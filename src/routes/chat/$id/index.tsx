import { createFileRoute } from "@tanstack/react-router";
import { useChatMessages } from "../../../features/chat/hooks";
import { ChatLog } from "../../../features/chat/components/chat-log";
import { useMainRouter } from "../../../lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useChatStore } from "../../../features/chat/stores";
import { Button } from "../../../components/button";
import { ArrowUpIcon } from "lucide-react";

export const Route = createFileRoute("/chat/$id/")({
	component: ChatPage,
});

const MainChatLog = () => {
	const messages = useChatMessages();

	return <ChatLog className="mx-auto px-xl w-full max-w-[75ch]" messages={messages} />;
};

interface ChatControlsProps {
	className?: string;
}

const ChatControls = () => {
	// const llmElements = useLLMElements();

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

		// chatStore.addMessage({
		// 	id: Date.now(),
		// 	role: "user",
		// 	content: data.message,
		// });

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
		<div className="p-md border-t border-l border-r border-border bg-surface-alt rounded-t-md">
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
			<div>
				{/* <div>
					{llmElements.map((llm) => (
						<div key={llm.id}>{llm.name}</div>
					))}
				</div> */}
				{/* {toggleButtonElements.map((button) => (
					<div key={button.id}>{button.label}</div>
				))} */}
			</div>
		</div>
	);
};

function ChatPage() {
	return (
		<div className="h-[100svh] flex flex-col flex-1">
			<div className="overflow-y-auto flex-1">
				<MainChatLog />
			</div>
			<div className="px-xl mx-auto max-h-[400px] w-full max-w-[80ch]">
				<ChatControls />
			</div>
		</div>
	);
}
