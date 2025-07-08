import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyState = ({ className, ...props }: EmptyStateProps) => {
	return <div className={clsx("empty-state", className)} {...props} />;
};

export interface EmptyStateHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyStateHeader = ({ className, ...props }: EmptyStateHeaderProps) => {
	return <div className={clsx("empty-state-header", className)} {...props} />;
};

export interface EmptyStateTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyStateTitle = ({ className, ...props }: EmptyStateTitleProps) => {
	return <div className={clsx("empty-state-title", className)} {...props} />;
};

export interface EmptyStateDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyStateDescription = ({ className, ...props }: EmptyStateDescriptionProps) => {
	return <div className={clsx("empty-state-description", className)} {...props} />;
};

export interface EmptyStateActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyStateActions = ({ className, ...props }: EmptyStateActionsProps) => {
	return <div className={clsx("empty-state-actions", className)} {...props} />;
};
