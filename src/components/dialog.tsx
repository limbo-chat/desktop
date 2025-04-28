import { Dialog as ArkDialog, Portal as ArkPortal } from "@ark-ui/react";
import clsx from "clsx";

export const DialogRoot = ArkDialog.Root;

export interface DialogTriggerProps extends ArkDialog.TriggerProps {}

export const DialogTrigger = ({ className, ...props }: DialogTriggerProps) => {
	return <ArkDialog.Trigger className={clsx("dialog-trigger", className)} {...props} />;
};

export interface DialogContentProps extends ArkDialog.ContentProps {}

export const DialogContent = ({ className, ...props }: DialogContentProps) => {
	return (
		<ArkPortal>
			<ArkDialog.Backdrop className="dialog-backdrop" />
			<ArkDialog.Positioner className="dialog-positioner">
				<ArkDialog.Content className={clsx("dialog-content", className)} {...props} />
			</ArkDialog.Positioner>
		</ArkPortal>
	);
};

export interface DialogTitleProps extends ArkDialog.TitleProps {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return <ArkDialog.Title className={clsx("dialog-title", className)} {...props} />;
};

export interface DialogDescriptionProps extends ArkDialog.DescriptionProps {}

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return <ArkDialog.Description className={clsx("dialog-description", className)} {...props} />;
};

export interface DialogCloseTriggerProps extends ArkDialog.CloseTriggerProps {}

export const DialogCloseTrigger = ({ className, ...props }: DialogCloseTriggerProps) => {
	return (
		<ArkDialog.CloseTrigger className={clsx("dialog-close-trigger", className)} {...props} />
	);
};
