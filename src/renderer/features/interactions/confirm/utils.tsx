import { useModalContext } from "../../modals/hooks";
import { showModal } from "../../modals/utils";
import { ConfirmDialog } from "./components/confirm-dialog";

export interface ShowConfirmDialogOptions {
	title: string;
	description?: string;
}

export function showConfirmDialog(opts: ShowConfirmDialogOptions): Promise<boolean> {
	return new Promise((resolve) => {
		showModal({
			id: "confirm-dialog",
			onClose: () => resolve(false),
			component: () => {
				const modalCtx = useModalContext();

				return (
					<ConfirmDialog
						title={opts.title}
						description={opts.description}
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
