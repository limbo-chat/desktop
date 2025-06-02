import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/button";
import {
	Dialog,
	DialogCloseButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogModalContent,
	DialogTitle,
} from "../../../components/dialog";
import {
	ModalCloseTrigger,
	ModalContent,
	ModalRoot,
	ModalTrigger,
} from "../../../components/modal";

export const Route = createFileRoute("/design-playground/elements/dialog")({
	component: DialogElementPage,
});

function DialogElementPage() {
	return (
		<div className="dialog-element-page">
			<ModalRoot>
				<ModalTrigger asChild>
					<Button>Open dialog</Button>
				</ModalTrigger>
				<DialogModalContent>
					<Dialog>
						<DialogCloseButton />
						<DialogHeader>
							<DialogTitle>Hello world!</DialogTitle>
							<DialogDescription>This is a dialog</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<ModalCloseTrigger asChild>
								<Button>Close dialog</Button>
							</ModalCloseTrigger>
						</DialogFooter>
					</Dialog>
				</DialogModalContent>
			</ModalRoot>
		</div>
	);
}
