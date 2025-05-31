import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/button";
import {
	DialogCloseButton,
	DialogCloseTrigger,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "../../../components/dialog";

export const Route = createFileRoute("/design-playground/elements/dialog")({
	component: DialogElementPage,
});

function DialogElementPage() {
	return (
		<DialogRoot>
			<DialogTrigger asChild>
				<Button>Open dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogCloseButton />
				<DialogHeader>
					<DialogTitle>Hello world!</DialogTitle>
					<DialogDescription>This is a dialog</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogCloseTrigger asChild>
						<Button>Close dialog</Button>
					</DialogCloseTrigger>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	);
}
