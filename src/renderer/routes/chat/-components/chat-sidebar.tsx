import { useSuspenseQuery } from "@tanstack/react-query";
import { useMatch, useRouter } from "@tanstack/react-router";
import { EllipsisIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { IconButton } from "../../../components/icon-button";
import { Link } from "../../../components/link";
import {
	MenuContent,
	MenuItem,
	MenuItemIcon,
	MenuItemLabel,
	MenuRoot,
	MenuSection,
	MenuSectionContent,
	MenuTrigger,
} from "../../../components/menu";
import {
	Sidebar,
	SidebarSection,
	SidebarSectionContent,
	SidebarItemLabel,
	SidebarSectionHeader,
	SidebarSectionTitle,
	SidebarLinkItem,
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
		<SidebarLinkItem
			to="/chat/$id"
			params={{
				id: chat.id,
			}}
		>
			<SidebarItemLabel>{chat.name}</SidebarItemLabel>
			<MenuRoot>
				<MenuTrigger asChild>
					<IconButton>
						<EllipsisIcon />
					</IconButton>
				</MenuTrigger>
				<MenuContent className="chat-menu">
					<MenuSection>
						<MenuSectionContent>
							<MenuItem
								data-action="rename"
								onClick={(e) => {
									e.stopPropagation();
									showDialog({
										component: () => <RenameChatDialog chat={chat} />,
									});
								}}
							>
								<MenuItemIcon>
									<PencilIcon />
								</MenuItemIcon>
								<MenuItemLabel>Rename</MenuItemLabel>
							</MenuItem>
							<MenuItem
								data-action="delete"
								onClick={(e) => {
									e.stopPropagation();
									handleDelete();
								}}
							>
								<MenuItemIcon>
									<Trash2Icon />
								</MenuItemIcon>
								<MenuItemLabel>Delete</MenuItemLabel>
							</MenuItem>
						</MenuSectionContent>
					</MenuSection>
				</MenuContent>
			</MenuRoot>
		</SidebarLinkItem>
	);
};

export const ChatSidebar = () => {
	const mainRouter = useMainRouter();
	const listChatsQuery = useSuspenseQuery(mainRouter.chats.list.queryOptions());

	return (
		<Sidebar className="chat-sidebar">
			<div className="chat0-sidebar-header">
				<div className="chat-sidebar-actions">
					<Link to="/chat" className="icon-button">
						<MessageCirclePlusIcon />
					</Link>
				</div>
			</div>
			<div className="chat-sidebar-content">
				<SidebarSection>
					<SidebarSectionHeader>
						<SidebarSectionTitle>All time</SidebarSectionTitle>
					</SidebarSectionHeader>
					<SidebarSectionContent>
						{listChatsQuery.data.map((chat) => (
							<ChatItem chat={chat} key={chat.id} />
						))}
					</SidebarSectionContent>
				</SidebarSection>
			</div>
		</Sidebar>
	);
};
