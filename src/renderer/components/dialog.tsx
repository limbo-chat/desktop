import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
	component?: React.ElementType;
}

export const Dialog = ({ component, className, ...props }: DialogProps) => {
	const Component = component ?? "div";

	return <Component className={clsx("dialog")} {...props} />;
};

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	return <div className={clsx("dialog-header", className)} {...props} />;
};

export interface DialogInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogInfo = ({ className, ...props }: DialogInfoProps) => {
	return <div className={clsx("dialog-info", className)} {...props} />;
};

export interface DialogTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return <div className={clsx("dialog-title", className)} {...props} />;
};

export interface DialogDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return <p className={clsx("dialog-description", className)} {...props} />;
};

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogContent = ({ className, ...props }: DialogContentProps) => {
	return <div className={clsx("dialog-content")} {...props} />;
};

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	return <div className={clsx("dialog-footer", className)} {...props} />;
};

export interface DialogActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogActions = ({ className, ...props }: DialogActionsProps) => {
	return <div className={clsx("dialog-actions", className)} {...props} />;
};
