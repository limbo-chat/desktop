import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SettingsPageProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsPage = ({ className, ...props }: SettingsPageProps) => {
	return <div className={clsx("settings-page", className)} {...props} />;
};

export interface SettingsPageHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsPageHeader = ({ className, ...props }: SettingsPageHeaderProps) => {
	return <div className={clsx("settings-page-header", className)} {...props} />;
};

export interface SettingsPageTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const SettingsPageTitle = ({ className, ...props }: SettingsPageTitleProps) => {
	return <h1 className={clsx("settings-page-title", className)} {...props} />;
};

export interface SettingsPageDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsPageDescription = ({ className, ...props }: SettingsPageDescriptionProps) => {
	return <div className={clsx("settings-page-description", className)} {...props} />;
};

export interface SettingsPageContentProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsPageContent = ({ className, ...props }: SettingsPageContentProps) => {
	return <div className={clsx("settings-page-content", className)} {...props} />;
};
