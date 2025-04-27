import { Link } from "@tanstack/react-router";
import { EllipsisIcon, MessageCirclePlusIcon, Trash2Icon } from "lucide-react";
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupTitle,
	SidebarItem,
} from "../../../components/sidebar";
import { iconButtonVariants } from "../../../components/icon-button";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import {
	MenuContent,
	MenuItem,
	MenuPositioner,
	MenuRoot,
	MenuTrigger,
} from "../../../components/menu";
import "./chat-sidebar.scss";

interface ChatItemProps {
	chat: {
		id: string;
		name: string;
	};
}

// TODO, fix the issue of the chat link navigating when the menu trigger is clicked
// TODO, when the current chat is deleted, the user should be redirected to the home page (the chat page)
const ChatItem = ({ chat }: ChatItemProps) => {
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();
	const deleteChatMutation = useMutation(mainRouter.chats.delete.mutationOptions());

	const handleDelete = () => {
		deleteChatMutation.mutate(
			{ id: chat.id },
			{
				onSuccess: () => {
					queryClient.setQueryData(mainRouter.chats.list.queryKey(), (oldChats) => {
						if (!oldChats) {
							return;
						}

						return oldChats.filter((c) => c.id !== chat.id);
					});
				},
				onError: (err) => {
					console.log("Failed to delete chat", err);
				},
			}
		);
	};

	return (
		<Link to="/chat/$id" params={{ id: chat.id }}>
			{({ isActive }) => (
				<SidebarItem isActive={isActive}>
					{chat.name}
					<MenuRoot>
						<MenuTrigger>
							<EllipsisIcon />
						</MenuTrigger>
						<MenuPositioner>
							<MenuContent>
								<MenuItem value="delete" onClick={handleDelete}>
									<Trash2Icon />
									Delete
								</MenuItem>
							</MenuContent>
						</MenuPositioner>
					</MenuRoot>
				</SidebarItem>
			)}
		</Link>
	);
};

export const ChatSidebar = () => {
	const mainRouter = useMainRouter();
	const listChatsQuery = useSuspenseQuery(mainRouter.chats.list.queryOptions());

	return (
		<Sidebar className="chat-sidebar">
			<div className="chat-sidebar-actions">
				<Link
					to="/chat"
					className={iconButtonVariants({
						color: "secondary",
						variant: "ghost",
					})}
				>
					<MessageCirclePlusIcon />
				</Link>
			</div>
			<div className="chat-sidebar-main">
				<SidebarGroup>
					<SidebarGroupTitle>All time</SidebarGroupTitle>
					<SidebarGroupContent>
						{listChatsQuery.data.map((chat) => (
							<ChatItem chat={chat} key={chat.id} />
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</div>
		</Sidebar>
	);
};
