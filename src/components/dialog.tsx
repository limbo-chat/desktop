import { Dialog as ArkDialog, Portal as ArkPortal } from "@ark-ui/react";
import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { XIcon } from "lucide-react";
import { IconButton, type IconButtonProps } from "./icon-button";

export interface DialogRootProps extends ArkDialog.RootProps {}

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

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	return <div className={clsx("dialog-header", className)} {...props} />;
};

export interface DialogTitleProps extends ArkDialog.TitleProps {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return <ArkDialog.Title className={clsx("dialog-title", className)} {...props} />;
};

export interface DialogDescriptionProps extends ArkDialog.DescriptionProps {}

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return <ArkDialog.Description className={clsx("dialog-description", className)} {...props} />;
};

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	return <div className={clsx("dialog-footer", className)} {...props} />;
};

export interface DialogCloseTriggerProps extends ArkDialog.CloseTriggerProps {}

export const DialogCloseTrigger = ({ className, ...props }: DialogCloseTriggerProps) => {
	return (
		<ArkDialog.CloseTrigger className={clsx("dialog-close-trigger", className)} {...props} />
	);
};

export interface DialogCloseButtonProps extends IconButtonProps {}

export const DialogCloseButton = ({ className, ...props }: DialogCloseButtonProps) => {
	return (
		<DialogCloseTrigger asChild>
			<IconButton
				color="secondary"
				variant="ghost"
				className={clsx("dialog-close-button", className)}
				{...props}
			>
				<XIcon />
			</IconButton>
		</DialogCloseTrigger>
	);
};
