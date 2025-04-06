import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMainRouter } from "../../lib/trpc";
import { Link, useParams } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createFileRoute("/chat")({
	component: ChatLayout,
});

const Sidebar = () => {
	const mainRouter = useMainRouter();
	const listChatsQuery = useSuspenseQuery(mainRouter.chats.list.queryOptions());
	const chats = listChatsQuery.data;

	const params = useParams({
		strict: false,
	});

	return (
		<div className="bg-surface w-[250px] p-md border-r flex flex-col border-border">
			<Link
				to="/chat"
				className="bg-primary p-sm rounded-md hover:bg-primary-hover text-center mb-md"
			>
				New Chat
			</Link>
			{chats.map((chat) => (
				<Link
					to={`/chat/$id`}
					params={{ id: chat.id.toString() }}
					className={clsx(
						"p-sm rounded-md hover:bg-secondary",
						params.id && chat.id === parseInt(params.id) && "bg-secondary"
					)}
					key={chat.id}
				>
					{chat.title}
				</Link>
			))}
		</div>
	);
};

function ChatLayout() {
	return (
		<div className="flex min-h-svh">
			<Sidebar />
			<Outlet />
		</div>
	);
}
