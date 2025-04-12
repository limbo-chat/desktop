import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
	component: ChatLayout,
});

const Sidebar = () => {
	return (
		<div className="bg-surface w-[250px] p-md border-r flex flex-col justify-between border-border">
			<div className="flex flex-col flex-1">
				<Link
					to="/chat"
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

function ChatLayout() {
	return (
		<div className="flex min-h-svh">
			<Sidebar />
			<Outlet />
		</div>
	);
}
