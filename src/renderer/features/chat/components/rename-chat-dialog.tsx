import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../components/button";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../components/dialog";
import * as FieldController from "../../../components/field-controller";
import { useModalContext } from "../../modals/hooks";
import { useRenameChatMutation } from "../hooks/queries";

interface RenameChatDialogProps {
	chat: {
		id: string;
		name: string;
	};
}

export const RenameChatDialog = ({ chat }: RenameChatDialogProps) => {
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
				data: {
					name: data.name,
				},
			},
			{
				onSuccess: () => {
					modalCtx.close();
				},
			}
		);
	});

	return (
		<FormProvider {...form}>
			<Dialog component="form" onSubmit={onSubmit}>
				<DialogHeader>
					<DialogTitle>Rename chat</DialogTitle>
				</DialogHeader>
				<DialogContent>
					<FieldController.Root id="name" name="name">
						<FieldController.TextInput placeholder="Enter a name" />
					</FieldController.Root>
				</DialogContent>
				<DialogFooter>
					<DialogActions>
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
					</DialogActions>
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};
