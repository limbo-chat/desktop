import { useModalContext } from "../../modals/hooks";
import { showModal } from "../../modals/utils";
import { ConfirmDialog, type ConfirmDialogProps } from "./components/confirm-dialog";

export type ShowConfirmDialogOptions = Omit<ConfirmDialogProps, "onConfirm" | "onCancel">;

export function showConfirmDialog(opts: ShowConfirmDialogOptions): Promise<boolean> {
	return new Promise((resolve) => {
		showModal({
			id: "confirm-dialog",
			onClose: () => resolve(false),
			component: () => {
				const modalCtx = useModalContext();

				return (
					<ConfirmDialog
						{...opts}
						onConfirm={() => {
							resolve(true);

							modalCtx.close();
						}}
						onCancel={() => {
							resolve(false);

							modalCtx.close();
						}}
					/>
				);
			},
		});
	});
}
