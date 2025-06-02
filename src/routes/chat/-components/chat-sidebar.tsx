import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useMatch, useRouter } from "@tanstack/react-router";
import { EllipsisIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/button";
import {
	Dialog,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogCloseButton,
} from "../../../components/dialog";
import { TextInput } from "../../../components/inputs/text-input";
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
import { useDeleteChatMutation, useRenameChatMutation } from "../../../features/chat/hooks/queries";
import { useModalContext } from "../../../features/modals/hooks";
import { showDialog } from "../../../features/modals/utils";
import { useMainRouter } from "../../../lib/trpc";

interface RenameChatDialogProps {
	chat: {
		id: string;
		name: string;
	};
}

const RenameChatDialog = ({ chat }: RenameChatDialogProps) => {
	const modalCtx = useModalContext();
	const renameChatMutation = useRenameChatMutation();

	const form = useForm({
		values: {
			name: chat.name,
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		renameChatMutation.mutate(
			{
				id: chat.id,
				name: data.name,
			},
			{
				onSuccess: (newha) => {
					modalCtx.close();
				},
			}
		);
	});

	return (
		<Dialog>
			<DialogHeader>
				<DialogTitle>Rename chat</DialogTitle>
			</DialogHeader>
			<form onSubmit={onSubmit}>
				<TextInput placeholder="Enter a name" {...form.register("name")} />
				<DialogFooter>
					<Button type="button" onClick={modalCtx.close}>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={!form.formState.isDirty}
						isLoading={renameChatMutation.isPending}
					>
						Save
					</Button>
				</DialogFooter>
			</form>
		</Dialog>
	);
};

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
