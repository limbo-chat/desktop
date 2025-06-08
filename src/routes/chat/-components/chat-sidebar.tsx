import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useMatch, useRouter } from "@tanstack/react-router";
import { EllipsisIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
	MenuContent,
	MenuItem,
	MenuItemIcon,
	MenuItemLabel,
	MenuRoot,
	MenuTrigger,
} from "../../../components/menu";
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupTitle,
	SidebarItem,
} from "../../../components/sidebar";
import { RenameChatDialog } from "../../../features/chat/components/rename-chat-dialog";
import { useDeleteChatMutation } from "../../../features/chat/hooks/queries";
import { showDialog } from "../../../features/modals/utils";
import { useMainRouter } from "../../../lib/trpc";

interface ChatItemProps {
	chat: {
		id: string;
		name: string;
	};
}

// TODO, fix the issue of the chat link navigating when the menu trigger is clicked
const ChatItem = ({ chat }: ChatItemProps) => {
	const router = useRouter();
	const deleteChatMutation = useDeleteChatMutation();

	const match = useMatch({
		strict: false,
	});

	const handleDelete = () => {
		deleteChatMutation.mutate(
			{ id: chat.id },
			{
				onSuccess: () => {
					// @ts-expect-error no typesafety here
					// if the current match is the chat we are deleting, navigate to the main chat list
					if (match.id === "/chat" && match.params.id === chat.id) {
						router.navigate({ to: "/chat" });
					}
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
						<MenuTrigger onClick={(e) => e.stopPropagation()}>
							<EllipsisIcon />
						</MenuTrigger>
						<MenuContent>
							<MenuItem
								data-action="rename"
								onClick={() =>
									showDialog({
										component: () => <RenameChatDialog chat={chat} />,
									})
								}
							>
								<MenuItemIcon>
									<PencilIcon />
								</MenuItemIcon>
								<MenuItemLabel>Rename</MenuItemLabel>
							</MenuItem>
							<MenuItem data-action="delete" onClick={handleDelete}>
								<MenuItemIcon>
									<Trash2Icon />
								</MenuItemIcon>
								<MenuItemLabel>Delete</MenuItemLabel>
							</MenuItem>
						</MenuContent>
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
				<Link to="/chat" className="icon-button">
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
