import { useSuspenseQuery } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";
import { AppIcon } from "../../../components/app-icon";
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
import { setActiveChatId } from "../../workspace/utils";

interface ChatItemProps {
	chat: {
		id: string;
		name: string;
	};
	isActive: boolean;
}

const ChatItem = ({ chat, isActive }: ChatItemProps) => {
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
		<div
			className="chat-item"
			data-is-active={isActive}
			onClick={() => {
				setActiveChatId(chat.id);
			}}
		>
			<div className="chat-item-name">{chat.name}</div>
			<MenuRoot>
				<MenuTrigger asChild>
					<IconButton>
						<AppIcon icon="menu" />
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
									<AppIcon icon="edit" />
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
									<AppIcon icon="delete" />
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

interface ChatSection {
	title: string;
	chats: { id: string; name: string; createdAt: string }[];
}

export const ChatListView = () => {
	const mainRouter = useMainRouter();
	const workspaceStore = useWorkspaceStore((state) => state.workspace?.activeChatId ?? null);
	const listChatsQuery = useSuspenseQuery(mainRouter.chats.list.queryOptions());
	const chats = listChatsQuery.data;

	const chatSections = useMemo<ChatSection[]>(() => {
		const sections: ChatSection[] = [];

		const today: ChatSection = { title: "Today", chats: [] };
		const last30Days: ChatSection = { title: "Last 30 Days", chats: [] };
		const older: ChatSection = { title: "Older", chats: [] };

		for (const chat of chats) {
			const numDaysAgo = differenceInDays(new Date(), new Date(chat.createdAt));

			if (numDaysAgo === 0) {
				today.chats.push(chat);
			} else if (numDaysAgo <= 30) {
				last30Days.chats.push(chat);
			} else {
				older.chats.push(chat);
			}
		}

		if (today.chats.length > 0) {
			sections.push(today);
		}

		if (last30Days.chats.length > 0) {
			sections.push(last30Days);
		}

		if (older.chats.length > 0) {
			sections.push(older);
		}

		return sections;
	}, [chats]);

	return (
		<div className="chat-list-view">
			{chatSections.map((section, idx) => (
				<div className="chat-list-section" key={idx}>
					<div className="chat-list-section-header">
						<div className="chat-list-section-title">{section.title}</div>
					</div>
					<div className="chat-list-section-content">
						{section.chats.map((chat) => (
							<ChatItem
								chat={chat}
								isActive={workspaceStore === chat.id}
								key={chat.id}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
};
