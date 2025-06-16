import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface ErrorContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorContainer = ({ className, ...props }: ErrorContainerProps) => {
	return <div className={clsx("error-container", className)} {...props} />;
};

export interface ErrorRootProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorRoot = ({ className, ...props }: ErrorRootProps) => {
	return <div className={clsx("error", className)} {...props} />;
};

export interface ErrorInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorInfo = ({ className, ...props }: ErrorInfoProps) => {
	return <div className={clsx("error-info", className)} {...props} />;
};

export interface ErrorTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorTitle = ({ className, ...props }: ErrorTitleProps) => {
	return <div className={clsx("error-title", className)} {...props} />;
};

export interface ErrorDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorDescription = ({ className, ...props }: ErrorDescriptionProps) => {
	return <div className={clsx("error-description", className)} {...props} />;
};

export interface ErrorControlProps extends HTMLAttributes<HTMLDivElement> {}

export const ErrorControl = ({ className, ...props }: ErrorControlProps) => {
	return <div className={clsx("error-control")} {...props} />;
};
