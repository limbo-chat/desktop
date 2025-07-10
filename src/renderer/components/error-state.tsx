import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorState = ({ className, ...props }: ErrorStateProps) => {
	return <div className={clsx("error-state", className)} {...props} />;
};

export interface ErrorStateTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorStateTitle = ({ className, ...props }: ErrorStateTitleProps) => {
	return <div className={clsx("error-state-title", className)} {...props} />;
};

export interface ErrorStateDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorStateDescription = ({ className, ...props }: ErrorStateDescriptionProps) => {
	return <div className={clsx("error-state-description", className)} {...props} />;
};

export interface ErrorStateActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorStateActions = ({ className, ...props }: ErrorStateActionsProps) => {
	return <div className={clsx("error-state-actions", className)} {...props} />;
};
