import clsx from "clsx";

export interface DialogProps extends React.ComponentProps<"div"> {
	component?: React.ElementType;
}

export const Dialog = ({ component, className, ...props }: DialogProps) => {
	const Component = component ?? "div";

	return (
		<Component
			className={clsx("dialog", className)}
			role="dialog"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-description"
			{...props}
		/>
	);
};

export interface DialogHeaderProps extends React.ComponentProps<"div"> {}

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	return <div className={clsx("dialog-header", className)} {...props} />;
};

export interface DialogTitleProps extends React.ComponentProps<"div"> {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return <div id="dialog-title" className={clsx("dialog-title", className)} {...props} />;
};

export interface DialogDescriptionProps extends React.ComponentProps<"div"> {}

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return (
		<p id="dialog-description" className={clsx("dialog-description", className)} {...props} />
	);
};

export interface DialogContentProps extends React.ComponentProps<"div"> {}

export const DialogContent = ({ className, ...props }: DialogContentProps) => {
	return <div className={clsx("dialog-content")} {...props} />;
};

export interface DialogFooterProps extends React.ComponentProps<"div"> {}

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	return <div className={clsx("dialog-footer", className)} {...props} />;
};

export interface DialogActionsProps extends React.ComponentProps<"div"> {}

export const DialogActions = ({ className, ...props }: DialogActionsProps) => {
	return <div className={clsx("dialog-actions", className)} {...props} />;
};
