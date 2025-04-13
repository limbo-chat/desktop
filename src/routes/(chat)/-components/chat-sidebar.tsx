import { Link } from "@tanstack/react-router";
import "./chat-sidebar.scss";

export const ChatSidebar = () => {
	return (
		<div className="chat-sidebar">
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
