import clsx from "clsx";

export interface ErrorStateProps extends React.ComponentProps<"div"> {}

export const ErrorState = ({ className, ...props }: ErrorStateProps) => {
	return <div className={clsx("error-state", className)} {...props} />;
};

export interface ErrorStateTitleProps extends React.ComponentProps<"div"> {}

export const ErrorStateTitle = ({ className, ...props }: ErrorStateTitleProps) => {
	return <div className={clsx("error-state-title", className)} {...props} />;
};

export interface ErrorStateDescriptionProps extends React.ComponentProps<"div"> {}

export const ErrorStateDescription = ({ className, ...props }: ErrorStateDescriptionProps) => {
	return <div className={clsx("error-state-description", className)} {...props} />;
};

export interface ErrorStateActionsProps extends React.ComponentProps<"div"> {}

export const ErrorStateActions = ({ className, ...props }: ErrorStateActionsProps) => {
	return <div className={clsx("error-state-actions", className)} {...props} />;
};
