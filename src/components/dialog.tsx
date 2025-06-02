import clsx from "clsx";
import { XIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useModalContext } from "../features/modals/hooks";
import { IconButton, type IconButtonProps } from "./icon-button";

export interface DialogRootProps extends HTMLAttributes<HTMLDivElement> {}

export const Dialog = ({ className, ...props }: DialogRootProps) => {
	return <div className={clsx("dialog")} {...props} />;
};

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	return <div className={clsx("dialog-header", className)} {...props} />;
};

export interface DialogTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return <div className={clsx("dialog-title", className)} {...props} />;
};

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return <p className={clsx("dialog-description", className)} {...props} />;
};

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	return <div className={clsx("dialog-footer", className)} {...props} />;
};

export interface DialogCloseButtonProps extends IconButtonProps {}

export const DialogCloseButton = ({ className, ...props }: DialogCloseButtonProps) => {
	const modalCtx = useModalContext();

	return (
		<IconButton
			onClick={modalCtx.close}
			className={clsx("dialog-close-button", className)}
			{...props}
		>
			<XIcon />
		</IconButton>
	);
};
