import { Link, useMatch, useMatches, useRouter } from "@tanstack/react-router";
import { EllipsisIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
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
import {
	DialogCloseButton,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	type DialogRootProps,
} from "../../../components/dialog";
import { Button } from "../../../components/button";
import { useForm } from "react-hook-form";
import { TextInput } from "../../../components/text-input";
import { useState } from "react";

interface RenameChatDialogProps {
	dialogProps: Omit<DialogRootProps, "children">;
	chat: {
		id: string;
		name: string;
	};
}

const RenameChatDialog = ({ chat, dialogProps }: RenameChatDialogProps) => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();
	const renameChatMutation = useMutation(mainRouter.chats.rename.mutationOptions());

	const form = useForm({
		defaultValues: {
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
				onSuccess: (updatedChat) => {
					queryClient.setQueryData(mainRouter.chats.list.queryKey(), (oldChats) => {
						if (!oldChats) {
							return;
						}

						return oldChats.map((chat) => {
							if (chat.id === updatedChat.id) {
								return updatedChat;
							}

							return chat;
						});
					});
					if (dialogProps.onOpenChange) {
						dialogProps.onOpenChange({ open: false });
					}
				},
				onError: () => {
					// show toast
				},
			}
		);
	});

	return (
		<DialogRoot {...dialogProps}>
			<DialogContent>
				<DialogCloseButton />
				<DialogHeader>
					<DialogTitle>Rename chat</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit}>
					<TextInput placeholder="Enter a name" {...form.register("name")} />
					<DialogFooter>
						<DialogCloseTrigger asChild>
							<Button variant="ghost" color="secondary">
								Cancel
							</Button>
						</DialogCloseTrigger>
						{/* TODO add loading indicator to buttons */}
						<Button type="submit" color="primary">
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</DialogRoot>
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
	const queryClient = useQueryClient();
	const mainRouter = useMainRouter();
	const deleteChatMutation = useMutation(mainRouter.chats.delete.mutationOptions());
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
		<>
			<RenameChatDialog
				chat={chat}
				dialogProps={{
					open: isRenameDialogOpen,
					onOpenChange: (e) => setIsRenameDialogOpen(e.open),
				}}
			/>
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
									<MenuItem
										value="rename"
										onClick={() => setIsRenameDialogOpen(true)}
									>
										<PencilIcon />
										Rename
									</MenuItem>
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
		</>
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
