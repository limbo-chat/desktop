import { useForm } from "react-hook-form";
import { Button } from "../../../components/button";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "../../../components/dialog";
import { TextInput } from "../../../components/inputs/text-input";
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
				name: data.name,
			},
			{
				onSuccess: () => {
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
