import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { AppIcon } from "./app-icon";
import { IconButton, type IconButtonProps } from "./icon-button";

export interface ViewProps extends HTMLAttributes<HTMLDivElement> {
	/** A unique ID for the view */
	id?: string;

	as?: React.ElementType;
}

export const View = ({ id, as: Component = "div", className, ...props }: ViewProps) => {
	return <Component className={clsx("view", className)} data-view={id} {...props} />;
};

export interface ViewHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const ViewHeader = ({ className, ...props }: ViewHeaderProps) => {
	return <div className={clsx("view-header", className)} {...props} />;
};

export interface ViewTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const ViewTitle = ({ className, ...props }: ViewTitleProps) => {
	return <div className={clsx("view-title", className)} {...props} />;
};

export const ViewBackIconButton = ({ className, ...props }: IconButtonProps) => {
	return (
		<IconButton className={clsx("view-back-button", className)} {...props}>
			<AppIcon icon="back" />
		</IconButton>
	);
};

export interface ViewHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const ViewHeaderActions = ({ className, ...props }: ViewHeaderActionsProps) => {
	return <div className={clsx("view-header-actions", className)} {...props} />;
};

export interface ViewContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ViewContent = ({ className, ...props }: ViewContentProps) => {
	return <div className={clsx("view-content", className)} {...props} />;
};

export interface ViewFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const ViewFooter = ({ className, ...props }: ViewFooterProps) => {
	return <div className={clsx("view-footer", className)} {...props} />;
};

export interface ViewFooterActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const ViewFooterActions = ({ className, ...props }: ViewFooterActionsProps) => {
	return <div className={clsx("view-footer-actions", className)} {...props} />;
};
