import * as RadixDialog from "@radix-ui/react-dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useMatch, useRouter } from "@tanstack/react-router";
import { EllipsisIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/button";
import {
	DialogCloseButton,
	DialogFooter,
	DialogHeader,
	Dialog,
	DialogTitle,
	DialogModalContent,
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
import { ModalRoot, type ModalRootProps } from "../../../components/modal";
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupTitle,
	SidebarItem,
} from "../../../components/sidebar";
import { useDeleteChatMutation, useRenameChatMutation } from "../../../features/chat/hooks/queries";
import { useMainRouter } from "../../../lib/trpc";

interface RenameChatDialogProps {
	chat: {
		id: string;
		name: string;
	};
	onRenameComplete: () => void;
	modalProps: ModalRootProps;
}

const RenameChatDialog = ({ chat, onRenameComplete, modalProps }: RenameChatDialogProps) => {
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
				onSuccess: () => {
					onRenameComplete();
				},
			}
		);
	});

	return (
		<ModalRoot {...modalProps}>
			<DialogModalContent>
				<Dialog>
					<DialogCloseButton />
					<DialogHeader>
						<DialogTitle>Rename chat</DialogTitle>
					</DialogHeader>
					<form onSubmit={onSubmit}>
						<TextInput placeholder="Enter a name" {...form.register("name")} />
						<DialogFooter>
							<RadixDialog.Close asChild>
								<Button>Cancel</Button>
							</RadixDialog.Close>
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
			</DialogModalContent>
		</ModalRoot>
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
	const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

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
		<>
			<RenameChatDialog
				chat={chat}
				modalProps={{
					open: isRenameDialogOpen,
					onOpenChange: setIsRenameDialogOpen,
				}}
				onRenameComplete={() => setIsRenameDialogOpen(false)}
			/>
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
									onClick={() => setIsRenameDialogOpen(true)}
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
		</>
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
