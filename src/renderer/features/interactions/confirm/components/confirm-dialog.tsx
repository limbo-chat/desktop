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
	confirmLabel?: string;
	cancelLabel?: string;
	style?: "default" | "destructive";
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDialog = ({
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	style = "default",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) => {
	return (
		<Dialog className="confirm-dialog" data-style={style}>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				{description && <DialogDescription>{description}</DialogDescription>}
			</DialogHeader>
			<DialogFooter>
				<Button className="confirm-dialog-cancel-button" onClick={onCancel}>
					{cancelLabel}
				</Button>
				<Button className="confirm-dialog-confirm-button" onClick={onConfirm}>
					{confirmLabel}
				</Button>
			</DialogFooter>
		</Dialog>
	);
};
