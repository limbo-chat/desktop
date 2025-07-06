import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/button";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogInfo,
	DialogTitle,
} from "../../../components/dialog";
import { useModalContext } from "../../../features/modals/hooks";
import { showDialog } from "../../../features/modals/utils";

export const Route = createFileRoute("/design-playground/elements/dialog")({
	component: DialogElementPage,
});

const DemoDialog = () => {
	const modalCtx = useModalContext();

	return (
		<Dialog>
			<DialogHeader>
				<DialogInfo>
					<DialogTitle>Hello world!</DialogTitle>
					<DialogDescription>This is a dialog</DialogDescription>
				</DialogInfo>
			</DialogHeader>
			<DialogContent>
				<p>
					Amet sit nisi ut velit sit non quis. Velit quis qui est do irure nisi aute.
					Dolor do reprehenderit non. Lorem consequat ex irure quis dolore est. Est anim
					magna et irure consequat est id. Enim fugiat sint in sint adipisicing laborum
					veniam. Et ipsum adipisicing ipsum proident deserunt culpa ex. Quis tempor
					commodo commodo anim.
				</p>
			</DialogContent>
			<DialogFooter>
				<DialogActions>
					<Button onClick={modalCtx.close}>Close dialog</Button>
				</DialogActions>
			</DialogFooter>
		</Dialog>
	);
};

function DialogElementPage() {
	return (
		<div className="dialog-element-page">
			<Button
				onClick={() =>
					showDialog({
						component: DemoDialog,
					})
				}
			>
				Open dialog
			</Button>
		</div>
	);
}
