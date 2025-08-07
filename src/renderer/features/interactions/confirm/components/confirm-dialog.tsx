import { Button } from "../../../../components/button";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../../components/dialog";

export interface ConfirmDialogProps {
	title: string;
	description?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDialog = ({ title, description, onConfirm, onCancel }: ConfirmDialogProps) => {
	return (
		<Dialog className="confirm-dialog">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				{description && <DialogDescription>{description}</DialogDescription>}
			</DialogHeader>
			<DialogFooter>
				<Button onClick={onCancel}>Cancel</Button>
				<Button onClick={onConfirm}>Confirm</Button>
			</DialogFooter>
		</Dialog>
	);
};
