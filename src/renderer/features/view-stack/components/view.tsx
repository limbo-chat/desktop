import type { HTMLAttributes } from "react";
import clsx from "clsx";
import { AppIcon } from "../../../components/app-icon";
import { IconButton, type IconButtonProps } from "../../../components/icon-button";
import { useViewStackContext } from "../hooks";

export interface RootProps extends HTMLAttributes<HTMLDivElement> {
	as?: React.ElementType;
}

export const Root = ({ as: Component = "div", className, ...props }: RootProps) => {
	return <Component className={clsx("view", className)} {...props} />;
};

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const Header = ({ className, ...props }: HeaderProps) => {
	return <div className={clsx("view-header", className)} {...props} />;
};

export interface StartSectionProps extends HTMLAttributes<HTMLDivElement> {}

export const HeaderStart = ({ className, ...props }: StartSectionProps) => {
	return <div className={clsx("view-header-start", className)} {...props} />;
};

export interface ViewTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const TitleProps = ({ className, ...props }: ViewTitleProps) => {
	return <div className={clsx("view-title", className)} {...props} />;
};

export const BackButton = ({ className, ...props }: IconButtonProps) => {
	const viewStack = useViewStackContext();

	return (
		<IconButton
			aria-label="Go back"
			className={clsx("view-back-button", className)}
			onClick={viewStack.pop}
			{...props}
		>
			<AppIcon icon="back" />
		</IconButton>
	);
};

export interface HeaderActions extends HTMLAttributes<HTMLDivElement> {}

export const HeaderActions = ({ className, ...props }: HeaderActions) => {
	return <div className={clsx("view-header-actions", className)} {...props} />;
};

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {}

export const Content = ({ className, ...props }: ContentProps) => {
	return <div className={clsx("view-content", className)} {...props} />;
};

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

export const Footer = ({ className, ...props }: FooterProps) => {
	return <div className={clsx("view-footer", className)} {...props} />;
};

export interface FooterActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const FooterActions = ({ className, ...props }: FooterActionsProps) => {
	return <div className={clsx("view-footer-actions", className)} {...props} />;
};
