import clsx from "clsx";

export interface EmptyStateProps extends React.ComponentProps<"div"> {}

export const EmptyState = ({ className, ...props }: EmptyStateProps) => {
	return <div className={clsx("empty-state", className)} {...props} />;
};

export interface EmptyStateTitleProps extends React.ComponentProps<"div"> {}

export const EmptyStateTitle = ({ className, ...props }: EmptyStateTitleProps) => {
	return <div className={clsx("empty-state-title", className)} {...props} />;
};

export interface EmptyStateDescriptionProps extends React.ComponentProps<"div"> {}

export const EmptyStateDescription = ({ className, ...props }: EmptyStateDescriptionProps) => {
	return <div className={clsx("empty-state-description", className)} {...props} />;
};

export interface EmptyStateActionsProps extends React.ComponentProps<"div"> {}

export const EmptyStateActions = ({ className, ...props }: EmptyStateActionsProps) => {
	return <div className={clsx("empty-state-actions", className)} {...props} />;
};
