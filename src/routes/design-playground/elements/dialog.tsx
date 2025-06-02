import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/button";
import {
	Dialog,
	DialogCloseButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../components/dialog";
import { showDialog } from "../../../features/modals/utils";

export const Route = createFileRoute("/design-playground/elements/dialog")({
	component: DialogElementPage,
});

const DemoDialog = () => {
	return (
		<Dialog>
			<DialogCloseButton />
			<DialogHeader>
				<DialogTitle>Hello world!</DialogTitle>
				<DialogDescription>This is a dialog</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button>Close dialog</Button>
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
