import { useSuspenseQuery } from "@tanstack/react-query";
import type { Assistant } from "../../../../../main/assistants/schemas";
import { AppIcon } from "../../../../components/app-icon";
import { Button } from "../../../../components/button";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../../components/dialog";
import { IconButton } from "../../../../components/icon-button";
import { Tooltip } from "../../../../components/tooltip";
import { useMainRouter } from "../../../../lib/trpc";
import { MarkdownContainer } from "../../../markdown/components/markdown-container";
import { MarkdownRenderer } from "../../../markdown/components/markdown-renderer";
import { useModalContext } from "../../../modals/hooks";
import { showModal } from "../../../modals/utils";
import { showNotification } from "../../../notifications/utils";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import type { ViewComponentProps } from "../../../view-stack/types";
import { useDeleteAssistantMutation } from "../../hooks/queries";

interface UninstallAssistantDialogProps {
	assistant: Assistant;
	onDelete: () => void;
}

const DeleteAssistantDialog = ({ assistant, onDelete }: UninstallAssistantDialogProps) => {
	const modalCtx = useModalContext();
	const deleteAssistantMutation = useDeleteAssistantMutation();

	const deleteAssistant = () => {
		deleteAssistantMutation.mutate(
			{
				id: assistant.id,
			},
			{
				onSuccess: () => {
					modalCtx.close();

					onDelete();
				},
			}
		);
	};

	return (
		<Dialog>
			<DialogHeader>
				<DialogTitle>Delete {assistant.name}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				<p>Are you sure you want to delete this assistant?</p>
			</DialogContent>
			<DialogFooter>
				<DialogActions>
					<Button onClick={modalCtx.close}>Cancel</Button>
					<Button isLoading={deleteAssistantMutation.isPending} onClick={deleteAssistant}>
						Delete
					</Button>
				</DialogActions>
			</DialogFooter>
		</Dialog>
	);
};

export interface ViewAssistantViewData {
	assistantId: string;
}

// funny name
export const ViewAssistantView = ({ view }: ViewComponentProps<ViewAssistantViewData>) => {
	const mainRouter = useMainRouter();
	const viewStack = useViewStackContext();

	const getAssistantQuery = useSuspenseQuery(
		mainRouter.assistants.get.queryOptions({
			id: view.data.assistantId,
		})
	);

	const assistant = getAssistantQuery.data;

	const copyAssistantToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(assistant));

			showNotification({
				level: "info",
				title: "Copied assistant to clipboard",
				message: "You can now import it elsewhere.",
			});
		} catch {}
	};

	return (
		<View.Root>
			<View.Header>
				<View.HeaderStart>
					<View.BackButton type="button" />
					<View.TitleProps>{assistant.name}</View.TitleProps>
				</View.HeaderStart>
				<View.HeaderActions>
					<Tooltip label="Delete assistant">
						<IconButton
							aria-label="Delete assistant"
							onClick={() => {
								showModal({
									id: "delete-assistant",
									component: () => (
										<DeleteAssistantDialog
											assistant={assistant}
											onDelete={() => {
												viewStack.pop();
											}}
										/>
									),
								});
							}}
						>
							<AppIcon icon="delete" />
						</IconButton>
					</Tooltip>
					<Tooltip label="Export assistant">
						<IconButton
							aria-label="Export assistant"
							onClick={copyAssistantToClipboard}
						>
							<AppIcon icon="upload" />
						</IconButton>
					</Tooltip>
					<Tooltip label="Edit assistant">
						<IconButton
							aria-label="Edit assistant"
							onClick={() => {
								viewStack.push({
									id: "edit-assistant",
									data: {
										assistantId: assistant.id,
									},
								});
							}}
						>
							<AppIcon icon="edit" />
						</IconButton>
					</Tooltip>
				</View.HeaderActions>
			</View.Header>
			<View.Content>
				<MarkdownContainer className="view-assistant-description">
					<MarkdownRenderer content={assistant.description} />
				</MarkdownContainer>
			</View.Content>
		</View.Root>
	);
};
