import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { IconButton, type IconButtonProps } from "./icon-button";

export interface DialogRootProps extends RadixDialog.DialogProps {}

export const DialogRoot = RadixDialog.Root;

export interface DialogTriggerProps extends RadixDialog.DialogTriggerProps {}

export const DialogTrigger = ({ className, ...props }: DialogTriggerProps) => {
	return <RadixDialog.Trigger className={clsx("dialog-trigger", className)} {...props} />;
};

export const DialogCloseTrigger = ({ className, ...props }: DialogTriggerProps) => {
	return <RadixDialog.Close className={clsx("dialog-close-trigger", className)} {...props} />;
};

export interface DialogContentProps extends RadixDialog.DialogContentProps {}

export const DialogContent = ({ className, ...props }: DialogContentProps) => {
	return (
		<RadixDialog.Portal>
			<RadixDialog.Overlay className="dialog-overlay" />
			<RadixDialog.Content className={clsx("dialog-content", className)} {...props} />
		</RadixDialog.Portal>
	);
};

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	return <div className={clsx("dialog-header", className)} {...props} />;
};

export interface DialogTitleProps extends RadixDialog.DialogTitleProps {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return <RadixDialog.Title className={clsx("dialog-title", className)} {...props} />;
};

export interface DialogDescriptionProps extends RadixDialog.DialogDescriptionProps {}

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return <RadixDialog.Description className={clsx("dialog-description", className)} {...props} />;
};

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	return <div className={clsx("dialog-footer", className)} {...props} />;
};

export interface DialogCloseButtonProps extends IconButtonProps {}

export const DialogCloseButton = ({ className, ...props }: DialogCloseButtonProps) => {
	return (
		<DialogCloseTrigger asChild>
			<IconButton className={clsx("dialog-close-button", className)} {...props}>
				<XIcon />
			</IconButton>
		</DialogCloseTrigger>
	);
};
