import { createFileRoute, Outlet, useParams, useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useChatStore } from "../../features/chat/stores";
import { Button } from "../../components/button";
import { ArrowUpIcon } from "lucide-react";

export const Route = createFileRoute("/(chat)")({
	component: ChatLayout,
});

const Sidebar = () => {
	return (
		<div className="bg-surface w-[250px] p-md border-r flex flex-col justify-between border-border">
			<div className="flex flex-col flex-1">
				<Link
					to="/"
					className="bg-primary p-sm rounded-md hover:bg-primary-hover text-center mb-md"
				>
					New Chat
				</Link>
			</div>
			<div>
				<Link to="/settings">
					<div className="bg-secondary p-sm rounded-md hover:bg-secondary-hover text-center">
						Open settings
					</div>
				</Link>
			</div>
		</div>
	);
};

const ChatComposer = () => {
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
		</div>
	);
};

function ChatLayout() {
	return (
		<div className="flex min-h-svh">
			<Sidebar />
			<div className="flex-1 flex flex-col max-h-svh">
				<div className="mx-auto max-w-[700px] w-full flex-1 overflow-y-auto">
					<Outlet />
				</div>
				<div className="mx-auto max-w-[750px] w-full">
					<ChatComposer />
				</div>
			</div>
		</div>
	);
}
