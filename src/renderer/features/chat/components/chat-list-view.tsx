import { useSuspenseQuery } from "@tanstack/react-query";
import { EllipsisIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { IconButton } from "../../../components/icon-button";
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
import { RenameChatDialog } from "../../../features/chat/components/rename-chat-dialog";
import { useDeleteChatMutation } from "../../../features/chat/hooks/queries";
import { showDialog } from "../../../features/modals/utils";
import { useMainRouter } from "../../../lib/trpc";
import { useWorkspaceStore } from "../../workspace/stores";

interface ChatItemProps {
	chat: {
		id: string;
		name: string;
	};
}

const ChatItem = ({ chat }: ChatItemProps) => {
	const deleteChatMutation = useDeleteChatMutation();

	const handleDelete = () => {
		deleteChatMutation.mutate(
			{ id: chat.id },
			{
				onSuccess: () => {
					const workspaceStore = useWorkspaceStore.getState();
					const workspaceState = workspaceStore.workspace!;

					if (workspaceState.activeChatId === chat.id) {
						workspaceStore.setActiveChatId(null);
					}
				},
			}
		);
	};

	return (
		<div className="chat-item">
			<div className="chat-item-name">{chat.name}</div>
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
		</div>
	);
};

export const ChatListView = () => {
	const mainRouter = useMainRouter();
	const listChatsQuery = useSuspenseQuery(mainRouter.chats.list.queryOptions());

	return (
		<div className="chat-list-view">
			<div className="chat-list-header">
				<div className="chat-list-actions">
					<IconButton>
						<MessageCirclePlusIcon />
					</IconButton>
				</div>
			</div>
			<div className="chat-list-content">
				{listChatsQuery.data.map((chat) => (
					<ChatItem chat={chat} key={chat.id} />
				))}
			</div>
		</div>
	);
};
